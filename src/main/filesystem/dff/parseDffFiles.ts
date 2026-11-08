import fs from 'fs';
import { type Config } from '../../config.defs';
import { DffEntry } from './DffEntry';

/**
 * @throws Error if the file content is invalid or if the number of mapped paths does not match the expected count.
 */
function dffEntriesFromRawText(config: Config, rawText: string): DffEntry[] {
    const rawLines = rawText.split(/[\n\r]+/).filter((line) => line.trim().length > 0);

    const entries: DffEntry[] = [];

    let currentLines: string[] = [];

    if (!config.silent) {
        process.stdout.write('Processed 0 entries');
    }

    function processCurrentLines(): void {
        if (currentLines.length > 0) {
            const entry = DffEntry.fromRawLines(config, currentLines);
            entries.push(entry);
            if (!config.silent) {
                process.stdout.clearLine(0);
                process.stdout.cursorTo(0);
                process.stdout.write(`Processed ${entries.length} entries`);
            }
        }
    }

    for (const line of rawLines) {
        if (line.startsWith('-')) {
            processCurrentLines();
            currentLines = [line];
        } else {
            currentLines.push(line);
        }
    }
    processCurrentLines();
    if (!config.silent) {
        process.stdout.write('\n');
    }
    if (config.debug) {
        console.debug(entries.map((entry) => entry.toString()).join('\n'));
    }
    return entries;
}

function parseDffFiles(config: Config, dffFiles: string[]): DffEntry[] {
    return dffFiles.flatMap((filePath) => {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return dffEntriesFromRawText(config, fileContent);
    });
}

export { parseDffFiles, dffEntriesFromRawText };
