import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

const nextAuthHandler = NextAuth(authOptions);

function ensureCorrectNextAuthUrl(req: NextRequest) {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || (host?.includes("localhost") || host?.includes("127.0.0.1") ? "http" : "https");
    if (host && (!process.env.NEXTAUTH_URL || (process.env.NEXTAUTH_URL.includes("localhost") && !host.includes("localhost")))) {
        process.env.NEXTAUTH_URL = `${proto}://${host}`;
    }
}

export async function GET(req: NextRequest, ctx: any) {
    ensureCorrectNextAuthUrl(req);
    return nextAuthHandler(req, ctx);
}

export async function POST(req: NextRequest, ctx: any) {
    ensureCorrectNextAuthUrl(req);
    return nextAuthHandler(req, ctx);
}

