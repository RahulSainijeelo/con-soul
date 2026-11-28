import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/config/firebase";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const usersRef = db.collection("users");
                    const snapshot = await usersRef.where("email", "==", credentials.email).get();

                    if (snapshot.empty) {
                        return null;
                    }

                    const userDoc = snapshot.docs[0];
                    const userData = userDoc.data();

                    const isValid = await bcrypt.compare(credentials.password, userData.password);

                    if (!isValid) {
                        return null;
                    }

                    return {
                        id: userDoc.id,
                        name: userData.name,
                        email: userData.email,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            }
        }),
    ],
    pages: {
        signIn: '/auth/login',
    },
    theme: {
        colorScheme: "light",
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google" && user?.email) {
                try {
                    const usersRef = db.collection("users");
                    const snapshot = await usersRef.where("email", "==", user.email).get();

                    if (snapshot.empty) {
                        const newUserRef = await usersRef.add({
                            name: user.name || "Google User",
                            email: user.email,
                            image: user.image || null,
                            provider: "google",
                            role: "customer",
                            createdAt: new Date().toISOString(),
                        });
                        user.id = newUserRef.id;
                    } else {
                        const existingDoc = snapshot.docs[0];
                        user.id = existingDoc.id;
                    }
                } catch (error) {
                    console.error("Error saving Google user to Firestore:", error);
                    // Gracefully allow login even if Firestore sync encounters an issue
                    if (!user.id) {
                        user.id = "g_" + Buffer.from(user.email).toString("hex").slice(0, 20);
                    }
                }
            }
            // Record login activity
            if (user?.email) {
                try {
                    await db.collection('loginActivity').add({
                        email: user.email,
                        name: user.name || 'Unknown',
                        image: user.image || null,
                        provider: account?.provider || 'credentials',
                        loginAt: new Date().toISOString(),
                    });
                } catch (err) {
                    console.error('Failed to record login activity:', err);
                }
            }
            return true;
        },
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) {
                return `${baseUrl}${url}`;
            }
            try {
                const parsedUrl = new URL(url);
                // Allow redirects to our production domain, Vercel deployments, or localhost
                if (
                    parsedUrl.hostname === "con-soul.in" ||
                    parsedUrl.hostname.endsWith(".con-soul.in") ||
                    parsedUrl.hostname.endsWith(".vercel.app") ||
                    parsedUrl.hostname === "localhost" ||
                    parsedUrl.hostname === "127.0.0.1"
                ) {
                    return url;
                }
            } catch {
                // Ignore parse errors and fall back to baseUrl
            }
            return baseUrl;
        },
        async session({ session, token }) {
            if (session?.user && token?.sub) {
                (session.user as any).id = token.sub;
                (session.user as any).role = (token as any).role || "customer";
            }
            return session;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.sub = user.id;
            }
            if (account?.provider === "google" && user?.email) {
                try {
                    const usersRef = db.collection("users");
                    const snapshot = await usersRef.where("email", "==", user.email).get();
                    if (!snapshot.empty) {
                        token.sub = snapshot.docs[0].id;
                        (token as any).role = snapshot.docs[0].data()?.role || "customer";
                    }
                } catch (err) {
                    console.error("Error fetching Google user in JWT callback:", err);
                }
            }
            return token;
        }
    },
    session: {
        strategy: "jwt",
    },
};
