import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { config } from "dotenv";

const packageRoot = dirname(fileURLToPath(import.meta.url as string));

config({ path: resolve(packageRoot, "../../../.env") });
config();

const runtimeEnv = typeof process === "undefined" ? {} : process.env;

export const env = new Proxy({} as Env, {
  get(_target, prop) {
    if (typeof prop !== "string") {
      return undefined;
    }

    return runtimeEnv[prop];
  },
});
