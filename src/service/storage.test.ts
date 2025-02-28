import { DatabaseService } from "./storage.server";

describe.skip("storage", () => {
  it("testDatabaseConnection", async () => {
    expect(await DatabaseService.getInstance().connection).toBeTruthy();
  });

  it("get tables", async () => {
    const t = await DatabaseService.getInstance().getAllTables();
    console.log("tables: ", t);
  });
});
