import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

/** In-memory SQLite for Better Auth CLI / Node-only tooling (not Workers). */
export function createInMemoryDb() {
  return drizzle(createClient({ url: ":memory:" }), { schema });
}

export type InMemoryDatabase = ReturnType<typeof createInMemoryDb>;
