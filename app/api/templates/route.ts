import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category") || "";
        const search = searchParams.get("search") || "";

        const templates = await prisma.documentTemplate.findMany({
            where: {
                AND: [
                    category ? { category: { contains: category } } : {},
                    search
                        ? {
                            OR: [
                                { title: { contains: search } },
                                { description: { contains: search } },
                            ],
                        }
                        : {},
                ],
            },
            select: {
                id: true,
                title: true,
                description: true,
                category: true,
                downloads: true,
                createdAt: true,
            },
            orderBy: { downloads: "desc" },
        });

        return NextResponse.json({ templates });
    } catch (error) {
        console.error("Templates API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch templates" },
            { status: 500 }
        );
    }
}
