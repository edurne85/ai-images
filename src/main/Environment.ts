/**
 * Rationale: These types (as well as the entries on `pathMappers.ts`) exist to facilitate interop between native Windows and WSL2 environments.
 *  If your sources and DB files exist on native Windows, set `defaultEnvironment` to `Environment.win` and paths will be automatically converted
 *  when running on WSL. Alternatively, if the files exist on WSL, set `defaultEnvironment` to `Environment.wsl` and paths will be automatically
 *  converted when running natively on Windows. If the sources and DB files exist on separate environments, omit the `defaultEnvironment` property
 *  and set `sourcesEnvironment` and `dbEnvironment` instead. When setting the `sourcesPathPrefix` and `dbPath` properties, use the path format of
 *  the environment where the files actually exist.
 * For any scenario outside Windows + WSL mixes, no path conversion is performed, and the app will assume the paths match the running environment.
 */

import fs from 'node:fs';
import { type PathMapperKey } from './filesystem';

enum Environment {
    win = 'win',
    wsl = 'wsl',
}

type OptionalEnvironment = Environment | undefined;

type Environments = {
    sourcesEnvironment?: Environment;
    dbEnvironment?: Environment;
    defaultEnvironment?: Environment;
};

function getRunningEnvironment(): OptionalEnvironment {
    if (process.platform === 'win32') {
        return Environment.win;
    } else if (process.platform === 'linux') {
        if (
            process.env.WSL_DISTRO_NAME ||
            process.env.WSL_INTEROP ||
            fs.existsSync('/proc/sys/fs/binfmt_misc/WSLInterop')
        ) {
            return Environment.wsl;
        }
        return undefined;
    } else {
        return undefined;
    }
}

function pickMapper(
    runningEnvironment: OptionalEnvironment,
    targetEnvironment: OptionalEnvironment
): PathMapperKey {
    if (!runningEnvironment || !targetEnvironment) {
        return 'ident';
    }
    if (runningEnvironment === Environment.win && targetEnvironment === Environment.wsl) {
        return 'wsl2win';
    } else if (runningEnvironment === Environment.wsl && targetEnvironment === Environment.win) {
        return 'win2wsl';
    } else {
        return 'ident';
    }
}

export {
    Environment,
    getRunningEnvironment,
    pickMapper,
    type OptionalEnvironment,
    type Environments,
};
