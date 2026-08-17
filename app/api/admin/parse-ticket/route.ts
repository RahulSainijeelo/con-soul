import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST /api/admin/parse-ticket — Parse IRCTC train ticket PDF
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        const session = await getServerSession(authOptions);
        if (!userId && !session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const pastedText = formData.get("text") as string | null;

        let text = "";

        if (file) {
            // Parse PDF file
            const pdfParse = (await import("pdf-parse")).default;
            const buffer = Buffer.from(await file.arrayBuffer());
            const pdfData = await pdfParse(buffer);
            text = pdfData.text;
        } else if (pastedText) {
            text = pastedText;
        } else {
            return NextResponse.json(
                { error: "Provide a PDF file or pasted ticket text" },
                { status: 400 }
            );
        }

        // Extract passengers from IRCTC ticket text
        const passengers = parseIRCTCTicket(text);

        return NextResponse.json({
            passengers,
            rawText: text.substring(0, 2000), // Return first 2000 chars for debugging
        });
    } catch (error: unknown) {
        console.error("Error parsing ticket:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to parse ticket" },
            { status: 500 }
        );
    }
}

interface ParsedPassenger {
    srNo: number;
    name: string;
    age: number;
    gender: string;
    seatNumber: string;
    status: string;
}

function parseIRCTCTicket(text: string): ParsedPassenger[] {
    const passengers: ParsedPassenger[] = [];
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

    // Pattern 1: Standard IRCTC e-ticket format
    // "1  DIPANSHU KUMAR  25  Male  S4  42  CNF"
    // or "1. DIPANSHU KUMAR / 25 / Male / S4 42 / Confirmed"
    const patterns = [
        // Pattern: "1  NAME  AGE  GENDER  COACH  BERTH  STATUS"
        /(\d+)\s+([A-Z][A-Z\s]+?)\s+(\d{1,3})\s+(Male|Female|M|F|Transgender)\s+([A-Z]\d*)\s+(\d+)\s+(CNF|RAC|WL|RLWL|GNWL|Confirmed|Waiting)/i,
        // Pattern: "1. NAME  AGE  GENDER  SEAT  STATUS"
        /(\d+)[.)]\s*([A-Z][A-Za-z\s]+?)\s+(\d{1,3})\s+(Male|Female|M|F)\s+([A-Z0-9]+[\s/-]*\d+)\s*(CNF|RAC|WL|Confirmed|Waiting)?/i,
        // Pattern: "SR NAME AGE SEX COACH BERTH STATUS" (table row)
        /^(\d+)\s+([A-Z][A-Za-z\s]{2,30}?)\s+(\d{1,3})\s+(M|F|Male|Female)\s+(\S+)\s+(\d+)\s+(.+)$/i,
        // Pattern: "1 NAME 25/M S4/42 CNF"
        /(\d+)\s+([A-Z][A-Za-z\s]+?)\s+(\d{1,3})\s*[/]\s*(M|F|Male|Female)\s+([A-Z]\d*)\s*[/]\s*(\d+)\s*(CNF|RAC|WL)?/i,
    ];

    for (const line of lines) {
        for (const pattern of patterns) {
            const match = line.match(pattern);
            if (match) {
                const srNo = parseInt(match[1]);
                const name = match[2].trim();
                const age = parseInt(match[3]);
                const gender = match[4];

                // Build seat number from coach + berth or direct
                let seatNumber: string;
                if (match[6] && /^\d+$/.test(match[6])) {
                    // Pattern has separate coach and berth
                    seatNumber = `${match[5]} ${match[6]}`;
                } else {
                    seatNumber = match[5];
                }

                const status = (match[7] || match[6] || "CNF").trim();

                // Skip duplicates
                if (!passengers.some((p) => p.srNo === srNo && p.name === name)) {
                    passengers.push({ srNo, name, age, gender, seatNumber, status });
                }
                break;
            }
        }
    }

    // Fallback: if no regex matched, try a simpler line-by-line parse
    if (passengers.length === 0) {
        let srCounter = 1;
        for (const line of lines) {
            // Look for lines containing age-like numbers and seat-like patterns
            const simpleMatch = line.match(
                /([A-Z][A-Za-z\s]+?)\s+(\d{1,2})\s*(?:\/\s*)?(M|F|Male|Female)?\s*.*?([A-Z]\d*[\s/-]*\d+)/i
            );
            if (simpleMatch) {
                passengers.push({
                    srNo: srCounter++,
                    name: simpleMatch[1].trim(),
                    age: parseInt(simpleMatch[2]),
                    gender: simpleMatch[3] || "Unknown",
                    seatNumber: simpleMatch[4].trim(),
                    status: "CNF",
                });
            }
        }
    }

    return passengers;
}
