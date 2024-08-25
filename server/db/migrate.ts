import config from "@/drizzle.config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.AUTH_DRIZZLE_URL,
});

const db = drizzle(pool);

async function main() {
  if (config.out) {
    await migrate(db, { migrationsFolder: config.out });
    console.log("Migration done!");
  }
}

main()
  .catch((e) => {
    console.error("migrate error", e);
  })
  .finally(async () => {
    await pool.end();
  });
