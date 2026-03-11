import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

// 30 requests per minute per IP
const LAWYERS_LIMIT = { limit: 30, windowSecs: 60 };

export async function GET(req: NextRequest) {
    // Rate limiting
    const ip = getClientIp(req);
    const rl = rateLimit(`lawyers:${ip}`, LAWYERS_LIMIT);
    if (!rl.success) {
        return NextResponse.json(
            { error: "Too many requests. Please slow down." },
            { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
        );
    }

    try {

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";
        const city = searchParams.get("city") || "";
        const specialization = searchParams.get("specialization") || "";
        const minRating = parseFloat(searchParams.get("minRating") || "0");
        const minExp = parseInt(searchParams.get("minExp") || "0");
        const maxFee = parseFloat(searchParams.get("maxFee") || "999999");
        const language = searchParams.get("language") || "";
        const verified = searchParams.get("verified") === "true" ? true : undefined;

        const lawyers = await prisma.lawyerProfile.findMany({
            where: {
                AND: [
                    city ? { city: { contains: city } } : {},
                    minRating > 0 ? { rating: { gte: minRating } } : {},
                    minExp > 0 ? { experienceYears: { gte: minExp } } : {},
                    maxFee < 999999 ? { consultationFee: { lte: maxFee } } : {},
                    verified !== undefined ? { isVerified: verified } : {},
                    specialization
                        ? {
                            specializations: {
                                some: { name: { contains: specialization } },
                            },
                        }
                        : {},
                    language
                        ? { languages: { some: { name: { contains: language } } } }
                        : {},
                    search
                        ? {
                            OR: [
                                { user: { name: { contains: search } } },
                                { city: { contains: search } },
                                {
                                    specializations: {
                                        some: { name: { contains: search } },
                                    },
                                },
                            ],
                        }
                        : {},
                ],
            },
            include: {
                user: { select: { name: true, image: true, email: true } },
                languages: true,
                specializations: true,
                modes: true,
            },
            // Initial sorting by rating to ensure secondary fallback is optimized
            orderBy: { rating: "desc" },
        });

        // Artificially float Elite and Pro subscribers to the top
        const tierWeights: Record<string, number> = {
            'ELITE': 3,
            'PRO': 2,
            'BASIC': 1
        };

        const sortedLawyers = lawyers.sort((a, b) => {
            const tierA = (a as any).subscriptionTier || 'BASIC';
            const tierB = (b as any).subscriptionTier || 'BASIC';
            const weightA = tierWeights[tierA] || 1;
            const weightB = tierWeights[tierB] || 1;
            
            if (weightA !== weightB) {
                return weightB - weightA; // Higher weight comes first
            }
            
            // Tie-breaker: rating
            return b.rating - a.rating;
        });

        return NextResponse.json({ lawyers: sortedLawyers, total: sortedLawyers.length });
    } catch (error) {
        console.error("Lawyers API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch lawyers" },
            { status: 500 }
        );
    }
}
