import sqlite3 from "sqlite3";
import { open } from "sqlite";
import {
  type PathMapper,
  pathMappers,
  type PathMapperKey,
} from "./pathMappers";

type RawConfig = {
  debug?: boolean;
  silent?: boolean;
  pathMapperKey?: PathMapperKey;
  sourcesPathPrefix: string;
  dbPath: string;
};

type Config = Required<RawConfig> & {
  pathMapper: PathMapper;
  db: Awaited<ReturnType<typeof open>> | null;
};

async function initializeConfig(rawConfig: RawConfig): Promise<Config> {
  // Initialize optional values:
  const debug = rawConfig.debug ?? false;
  const silent = rawConfig.silent ?? !debug;
  const pathMapperKey: PathMapperKey = rawConfig.pathMapperKey ?? "ident";
  // Initialize computed values:
  const pathMapper = pathMappers[pathMapperKey];
  // Establish DB connection:
  let db: Awaited<ReturnType<typeof open>> | null = null;
  const dbFile = pathMapper(rawConfig.dbPath);
  if (debug) {
    sqlite3.verbose();
  }
  try {
    db = await open({
      filename: dbFile,
      driver: sqlite3.Database,
    });
  } catch (error) {
    console.error(`Failed to open database at ${rawConfig.dbPath}:`, error);
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
