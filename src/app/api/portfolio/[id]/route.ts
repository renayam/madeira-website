import { DatabaseService } from "../../../../service/storage.server";
import { PortfolioItemModel } from "@/types/portfolio";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
    const id = request.nextUrl.pathname.split("/").pop();

    if (!id) {
        return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });
    }

    const instance = await DatabaseService.getInstance();
    await PortfolioItemModel.initialize(instance);
    const portfolioItem = await PortfolioItemModel.findByPk(id);

    if (!portfolioItem) {
        return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 });
    }

    await portfolioItem.destroy();
    return NextResponse.json({ message: "Portfolio item deleted successfully" }, { status: 200 });
}
