import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { type PathMapper, pathMappers } from './filesystem';
import { Environment, getRunningEnvironment, pickMapper, type Environments } from './Environment';

type RawConfig = Environments & {
    debug?: boolean;
    silent?: boolean;
    autoDeleteDuplicates?: boolean;
    sourcesPathPrefix: string;
    dbPath: string;
    dffPath?: Nullable<string>;
};

type CleanRawConfig = Environments & Required<Omit<RawConfig, keyof Environments>>;

type Config = CleanRawConfig & {
    sourcesPathMapper: PathMapper;
    dbPathMapper: PathMapper;
    dffMappedPath: Nullable<string>;
    db: Awaited<ReturnType<typeof open>> | null;
    runningEnvironment: ReturnType<typeof getRunningEnvironment>;
};

async function initializeConfig(rawConfig: RawConfig): Promise<Config> {
    // Initialize optional values:
    const debug = rawConfig.debug ?? false;
    const silent = rawConfig.silent ?? !debug;
    const autoDeleteDuplicates = rawConfig.autoDeleteDuplicates ?? false;
    const sourcesEnvironment = rawConfig.sourcesEnvironment ?? rawConfig.defaultEnvironment;
    const dbEnvironment = rawConfig.dbEnvironment ?? rawConfig.defaultEnvironment;
    const runningEnvironment = getRunningEnvironment();
    const sourcesPathMapper = pathMappers[pickMapper(runningEnvironment, sourcesEnvironment)];
    const dbPathMapper = pathMappers[pickMapper(runningEnvironment, dbEnvironment)];
    const dffPathMapper = pathMappers[pickMapper(runningEnvironment, Environment.win)];
    const dffPath = rawConfig.dffPath ?? null;
    const dffMappedPath = dffPath ? dffPathMapper(dffPath) : null;
    // Establish DB connection:
    let db: Awaited<ReturnType<typeof open>> | null = null;
    const dbFile = dbPathMapper(rawConfig.dbPath);
    if (debug) {
        sqlite3.verbose();
    }
    try {
        db = await open({
            filename: dbFile,
            driver: sqlite3.Database,
        });
        if (debug) {
            const tables = await db.all(
                'SELECT name FROM sqlite_master WHERE type="table" ORDER BY name ASC;'
            );
            console.log(
                `Opened database at ${dbFile}, found tables:\n${tables.map((row) => row.name).join(', ')}`
            );
        }
    } catch (error) {
        console.error(`Failed to open database at ${rawConfig.dbPath}:`, error);
    }
    return {
        ...rawConfig,
        debug,
        silent,
        autoDeleteDuplicates,
        dffPath,
        // Additional / computed values:
        sourcesEnvironment,
        dbEnvironment,
        runningEnvironment,
        sourcesPathMapper,
        dbPathMapper,
        dffMappedPath,
        db,
    };
}

export type { RawConfig, Config };
export { initializeConfig };
