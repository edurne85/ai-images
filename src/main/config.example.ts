import { type RawConfig } from './config.defs';
import { Environment } from './Environment';

const rawConfig: RawConfig = {
    silent: false,
    defaultEnvironment: Environment.win,
    sourcesPathPrefix: 'C:\\Users\\ExampleUser\\Images\\',
    dbPath: 'C:\\Users\\ExampleUser\\Images\\db.sqlite',
    dffPath: 'C:\\Program Files (x86)\\Duplicate Files Finder\\dupf.exe',
};

export { rawConfig };
