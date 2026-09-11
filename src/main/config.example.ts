import { type RawConfig } from './config.defs';
import { Environment } from './Environment';

const rawConfig: RawConfig = {
    defaultEnvironment: Environment.win,
    sourcesPathPrefix: 'C:\\Users\\ExampleUser\\Images\\',
    dbPath: 'C:\\Users\\ExampleUser\\Images\\db.sqlite',
    silent: false,
};

export { rawConfig };
