import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/db/schema/index.ts",
  out: "./server/db/migrations",
  dbCredentials: {
    url: process.env.AUTH_DRIZZLE_URL!,
  },
});
