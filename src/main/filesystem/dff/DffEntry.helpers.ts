import { Config } from '../../config.defs';

type DffEntryBuilder = {
    config: Config;
    expectedCount: number;
    expectedSize: number;
    mappedPaths: string[];
};

/* Exmaple first line:
    Obsolete (GUI / file only)
    - 2 equal files of size 2251639
    /^\s*-\s+(\d+)\s+equal files of size\s+(\d+)\s*$/;
    Current (CLI mode)
    - Equal (3 files of size 10904006):
*/
const firstLineRegexp = /^\s*- Equal \((\d+)\s+files of size\s+(\d+)\):\s*$/;

function preTrim(str: string): string {
    const spaceTrimmed = str.trim();
    const isQuoted =
        spaceTrimmed.length >= 2 &&
        spaceTrimmed[0] === '"' &&
        spaceTrimmed[spaceTrimmed.length - 1] === '"';
    return isQuoted ? spaceTrimmed.slice(1, -1) : spaceTrimmed;
}

export { type DffEntryBuilder, firstLineRegexp, preTrim };
