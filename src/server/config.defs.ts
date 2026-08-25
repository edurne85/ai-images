import sqlite3 from "sqlite3";
import { open } from "sqlite";
import {
  type PathMapper,
  pathMappers,
  type PathMapperKey,
} from "./pathMappers.ts";

type RawConfig = {
  debug?: boolean;
  silent?: boolean;
  pathMapperKey?: PathMapperKey;
  sourcesPathPrefix: string;
  dbPath: string;
};

type Config = Required<RawConfig> & {
  pathMapper: PathMapper;
  db: Awaited<ReturnType<typeof open>>;
};

async function initializeConfig(rawConfig: RawConfig): Promise<Config> {
  // Initialize optional values:
  const debug = rawConfig.debug ?? false;
  const silent = rawConfig.silent ?? !debug;
  const pathMapperKey: PathMapperKey = rawConfig.pathMapperKey ?? "ident";
  const pathMapper = pathMappers[pathMapperKey];
  // TODO: Establish DB connection, pregenerate some stuff, etc.
  let db: Awaited<ReturnType<typeof open>>;
  try {
    db = await open({
      filename: rawConfig.dbPath,
      driver: sqlite3.Database,
    });
  } catch (error) {
    console.error(`Failed to open database at ${rawConfig.dbPath}:`, error);
    throw error;
  }
  if (debug) {
    sqlite3.verbose();
  }
  return {
    ...rawConfig,
    debug,
    silent,
    pathMapperKey,
    // Additional / computed values:
    pathMapper,
    db,
  };
}

export type { RawConfig, Config };
export { initializeConfig };
