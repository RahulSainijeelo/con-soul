import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/config/firebase";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
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
        colorScheme: "dark",
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
                    return false;
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (session?.user && token?.sub) {
                (session.user as any).id = token.sub;
            }
            return session;
        },
        async jwt({ token, user, account }) {
            if (account?.provider === "google" && user?.email) {
                try {
                    const usersRef = db.collection("users");
                    const snapshot = await usersRef.where("email", "==", user.email).get();
                    if (!snapshot.empty) {
                        token.sub = snapshot.docs[0].id;
                    }
                } catch (err) {
                    console.error("Error fetching Google user in JWT callback:", err);
                }
            } else if (user) {
                token.sub = user.id;
            }
            return token;
        }
    },
    session: {
        strategy: "jwt",
    },
};
