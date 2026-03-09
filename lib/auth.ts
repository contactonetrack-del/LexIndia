import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import type { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/",
    },
    providers: [
        // ── Google OAuth ──────────────────────────────────────────────────────
        ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
            ? [
                GoogleProvider({
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    profile(profile) {
                        return {
                            id: profile.sub,
                            name: profile.name,
                            email: profile.email,
                            image: profile.picture,
                            // Google users default to CITIZEN; they can upgrade to LAWYER later
                            role: "CITIZEN",
                        };
                    },
                }),
            ]
            : []),

        // ── Credentials ───────────────────────────────────────────────────────
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    include: { lawyerProfile: true },
                });

                if (!user || !user.password) {
                    throw new Error("Invalid email or password");
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error("Invalid email or password");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.role = (user as any).role ?? "CITIZEN";
                token.id = user.id;
            }
            // Preserve role on token refresh
            if (!token.role) {
                const dbUser = await prisma.user.findUnique({ where: { id: token.sub as string }, select: { role: true } });
                token.role = dbUser?.role ?? "CITIZEN";
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.role = token.role as string;
                session.user.id = token.id as string;
            }
            return session;
        },
        async signIn({ user, account }) {
            // For OAuth sign-ins, ensure the user has a role field in DB
            if (account?.provider === "google" && user.id) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { role: "CITIZEN" },
                }).catch(() => {/* user may not exist yet — adapter will create */ });
            }
            return true;
        },
    },

    events: {
        async createUser({ user }) {
            // Ensure every newly created user (via OAuth) has a default role
            if (!user.id) return;
            await prisma.user.update({
                where: { id: user.id },
                data: { role: "CITIZEN" },
            }).catch(console.error);
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
};
