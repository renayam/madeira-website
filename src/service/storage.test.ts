import { DatabaseService } from "./storage";

describe("storage", () => {
  it("testDatabaseConnection", async () => {
    expect(await DatabaseService.getInstance().testConnection()).toBeTruthy();
  });

  it("syncDatabase", async () => {
    await DatabaseService.getInstance().sync();
  });

  it("get table", async () => {
    const t = await DatabaseService.getInstance().getAllTables();
    console.log("tables: ", t);
  });
});
