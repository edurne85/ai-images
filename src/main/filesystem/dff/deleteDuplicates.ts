import fs from 'fs';
import { type DffEntry } from './DffEntry';
import { type Config } from '../../config.defs';
import { runDffParsed } from './DffRunner';

function deleteDuplicates(config: Config, ...entries: DffEntry[]): number {
    let count = 0;
    for (const entry of entries) {
        for (const file of entry.allButOldestFiles) {
            try {
                fs.unlinkSync(file.fullPath);
                count++;
            } catch (e) {
                if (!config.silent) {
                    console.error(e);
                }
            }
        }
    }
    return count;
}

function deleteAllDuplicates(config: Config): number {
    const entries = runDffParsed(config);
    return deleteDuplicates(config, ...entries);
}

export { deleteDuplicates, deleteAllDuplicates };
