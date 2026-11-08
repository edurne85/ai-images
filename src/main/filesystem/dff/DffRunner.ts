import { execSync } from 'child_process';
import { Config } from '../../config.defs';
import { type DffEntry } from './DffEntry';
import { dffEntriesFromRawText } from './parseDffFiles';
import { Environment, pickMapper } from '../../Environment';
import { pathMappers } from '../pathMappers';

function runDff(config: Config, targetPath?: string): Nullable<string> {
    if (!config.dffMappedPath) {
        return null;
    }
    // DFF will expect a windows path even when called from WSL!
    if (!targetPath) {
        const mapper = pickMapper(Environment.win, config.sourcesEnvironment);
        targetPath = pathMappers[mapper](config.sourcesPathPrefix).replaceAll('\\', '\\\\');
    }
    const command = `"${config.dffMappedPath}" -q "${targetPath}"`;
    const output = execSync(command, { encoding: 'utf-8' }).trim();
    return output;
}

function runDffParsed(config: Config, targetPath?: string): DffEntry[] {
    const output = runDff(config, targetPath);
    return output ? dffEntriesFromRawText(config, output) : [];
}

export { runDff, runDffParsed };
