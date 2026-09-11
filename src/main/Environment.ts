import fs from 'node:fs';
import { type PathMapperKey } from './pathMappers';

enum Environment {
    win = 'win',
    wsl = 'wsl',
}

type OptionalEnvironment = Environment | undefined;

type Environments = {
    sourcesEnvironment?: OptionalEnvironment;
    dbEnvironment?: OptionalEnvironment;
    defaultEnvironment?: OptionalEnvironment;
};

function getRunningEnvironment(): OptionalEnvironment | undefined {
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
