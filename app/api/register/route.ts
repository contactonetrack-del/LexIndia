import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

// 5 registrations per IP per 15 minutes
const REGISTER_LIMIT = { limit: 5, windowSecs: 15 * 60 };

export async function POST(req: NextRequest) {
    // ── Rate Limiting ───────────────────────────────────────────────────────
    const ip = getClientIp(req);
    const rl = rateLimit(`register:${ip}`, REGISTER_LIMIT);

    if (!rl.success) {
        return NextResponse.json(
            {
                error: "Too many requests. Please wait before trying again.",
                retryAfter: Math.ceil((rl.resetAt - Date.now()) / 1000),
            },
            {
                status: 429,
                headers: {
                    "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
                    "X-RateLimit-Limit": String(REGISTER_LIMIT.limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": String(Math.ceil(rl.resetAt / 1000)),
                },
            }
        );
    }

    // ── Validation ──────────────────────────────────────────────────────────
    const body = await req.json().catch(() => null);
    if (!body) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { name, email, password, role, consentTimestamp, consentVersion } = body;

    if (!name?.trim() || !email?.trim() || !password) {
        return NextResponse.json(
            { error: "Name, email, and password are required" },
            { status: 400 }
        );
    }

    if (password.length < 8) {
        return NextResponse.json(
            { error: "Password must be at least 8 characters" },
            { status: 400 }
        );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // ── Duplicate Check ─────────────────────────────────────────────────────
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return NextResponse.json(
            { error: "An account with this email already exists" },
            { status: 409 }
        );
    }

    // ── Create User ─────────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: role === "LAWYER" ? "LAWYER" : "CITIZEN",
            consentTimestamp: consentTimestamp ? new Date(consentTimestamp) : new Date(),
            consentVersion: consentVersion || "1.0",
        },
    });

    try {
        const verificationToken = await generateVerificationToken(user.email!);
        if (verificationToken) {
            await sendVerificationEmail(user.email!, verificationToken.token);
        }
    } catch (error) {
        console.error("Failed to send verification email:", error);
        // We still return 201 as the user was successfully created
    }

    return NextResponse.json(
        { message: "Account created successfully", userId: user.id },
        {
            status: 201,
            headers: {
                "X-RateLimit-Limit": String(REGISTER_LIMIT.limit),
                "X-RateLimit-Remaining": String(rl.remaining),
            },
        }
    );
}
