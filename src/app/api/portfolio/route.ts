import { NextRequest, NextResponse } from "next/server";
import { PortfolioItem } from "@/types/portfolio";
import { PortfolioItemModel } from "@/types/portfolio";
import { DatabaseService } from "@/service/storage";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const TypedPortfolioItem = body as PortfolioItem;
        TypedPortfolioItem.id = 0;
        const instance = await DatabaseService.getInstance();
        await PortfolioItemModel.initialize(instance)
        const portfolioItem = await PortfolioItemModel.create(TypedPortfolioItem);
        return NextResponse.json(portfolioItem);
    } catch (error) {
        console.error('Failed to create portfolio item:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'An unknown error occurred' },
            { status: 500 }
        );
    }
}