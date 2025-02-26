import { DatabaseService } from "./storage";

describe("test connection", () => {
  it("testDatabaseConnection", async () => {
    expect(await DatabaseService.testConnection()).toBeTruthy();
  });
});

describe("sync databasemodel", () => {
  it("syncDatabase", async () => {
    await DatabaseService.sync();
  });
});
