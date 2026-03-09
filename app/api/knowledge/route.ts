import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const categories = await prisma.fAQCategory.findMany({
            include: {
                faqs: {
                    select: { id: true, question: true, answer: true },
                    orderBy: { createdAt: "asc" },
                },
            },
            orderBy: { name: "asc" },
        });

        return NextResponse.json({ categories });
    } catch (error) {
        console.error("Knowledge API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch knowledge base" },
            { status: 500 }
        );
    }
}
