import { DatabaseService } from "@/service/storage";

export function GET() {
  try {
    DatabaseService.getInstance();
  } catch (error) {
    console.log(error);
  }
  return "good";
}
