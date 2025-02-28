import { DatabaseService } from "../../../../service/storage.server";
import { PortfolioItemModel } from "@/types/portfolio";
import { NextRequest, NextResponse } from "next/server";

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
