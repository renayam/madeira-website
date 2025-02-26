import { DatabaseService } from "./storage";

describe("storage", () => {
  it("testDatabaseConnection", async () => {
    expect(await DatabaseService.testConnection()).toBeTruthy();
  });

  // it("syncDatabase", async () => {
  //   await DatabaseService.sync();
  // });

  it("get table", async () => {
    const t = await DatabaseService.getAllTable();
    console.log("tables: ", t);
  });
});
