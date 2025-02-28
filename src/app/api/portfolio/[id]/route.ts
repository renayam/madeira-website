import { DatabaseService } from "@/service/storage";
import { PortfolioItemModel } from "@/types/portfolio";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();

        const instance = await DatabaseService.getInstance();
        await PortfolioItemModel.initialize(instance);

        const portfolioItem = await PortfolioItemModel.findByPk(id);
        if (!portfolioItem) {
            return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 });
        }

        await portfolioItem.update(body);
        const updatedItem = await portfolioItem.reload();

        return NextResponse.json(updatedItem);
    } catch (error) {
        console.error('Failed to update portfolio item:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'An unknown error occurred' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const instance = await DatabaseService.getInstance();
    await PortfolioItemModel.initialize(instance);
    const portfolioItem = await PortfolioItemModel.findByPk(id);
    if (!portfolioItem) {
        return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 });
    }
    await portfolioItem.destroy();
    return NextResponse.json({ message: "Portfolio item deleted successfully" }, { status: 200 });
}
