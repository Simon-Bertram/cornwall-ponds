import { env } from "@cornwall-ponds/env/server";
import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema";

export type DbBindings = {
  DB: D1Database;
};

export function createDb(bindings?: DbBindings) {
  const d1 = bindings?.DB ?? env.DB;
  return drizzle(d1, { schema });
}
