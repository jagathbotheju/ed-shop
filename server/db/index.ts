import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import "dotenv/config";
import * as schema from "@/server/db/schema";

const pool = new Pool({
  connectionString: process.env.AUTH_DRIZZLE_URL,
});

export const db = drizzle(pool, { schema });

export type DB = typeof db;
