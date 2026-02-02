import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { sequelize } from "@/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();

  logger.info("Example API route called", { requestId });

  try {
    const startTime = performance.now();
    const [tables] = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()",
    );
    const duration = performance.now() - startTime;

    logger.info("Database operation completed", {
      requestId,
      operation: "getAllTables",
      durationMs: duration,
      tableCount: tables.length,
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: { tables, timestamp: new Date().toISOString() },
    });
  } catch (error) {
    logger.error("Error in example API route", { requestId, error });
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
