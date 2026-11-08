import fs from 'fs';
import {
    type FileReference,
    oldestFileReference,
    allButOldestFileReferences,
    fileReferenceToString,
} from '../FileReference';
import { type DffEntryBuilder, firstLineRegexp, preTrim } from './DffEntry.helpers';
import { type Config } from '../../config.defs';
import { getReliableBirthTime } from '../getWindowsCreationTime';

class DffEntry {
    #expectedCount: number;
    #expectedSize: number;
    #files: FileReference[];

    private constructor({ config, expectedCount, expectedSize, mappedPaths }: DffEntryBuilder) {
        this.#expectedCount = expectedCount;
        this.#expectedSize = expectedSize;
        this.#files = mappedPaths.map((path) => {
            if (path.length === 0) {
                throw new Error('Mapped paths cannot be empty');
            }
            const stats = fs.statSync(path); // Throws if the file does not exist
            if (!stats.isFile()) {
                throw new Error(`Mapped path is not a file: ${path}`);
            }
            if (stats.size !== this.#expectedSize) {
                throw new Error(
                    `Mapped file size (${stats.size}) does not match expected size (${this.#expectedSize}): ${path}`
                );
            }
            const { size, mtime } = stats;
            const mappedPrefix = config.sourcesPathMapper(config.sourcesPathPrefix);
            const prefixTrimmed = path.replaceAll(mappedPrefix, '');
            const [basename, ...pathFragments] = prefixTrimmed.split(/[\\/]/).reverse();
            const group = pathFragments.reverse().join('/');
            return {
                fullPath: path,
                group,
                basename,
                size,
                mtime,
                birthtime: getReliableBirthTime(stats, path),
            };
        });
        if (this.#files.length !== this.#expectedCount) {
            throw new Error(
                `Expected ${this.#expectedCount} mapped files, but got ${this.#files.length}`
            );
        }
    }

    get count(): number {
        return this.#expectedCount;
    }

    get size(): number {
        return this.#expectedSize;
    }

    get mappedPaths(): string[] {
        return this.#files.map((f) => f.fullPath);
    }

    get oldestFile(): FileReference {
        return oldestFileReference(this.#files);
    }

    get allButOldestFiles(): FileReference[] {
        return allButOldestFileReferences(this.#files);
    }

    toString(): string {
        const lines = [
            ` - ${this.#expectedCount} equal files of size ${this.#expectedSize}`,
            ...this.#files.map((f) => fileReferenceToString(f, '   ')),
        ];
        return lines.join('\n');
    }

    static fromRawLines(config: Config, lines: string[]): DffEntry {
        const [firstLine, ...restLines] = lines;
        const match = firstLineRegexp.exec(firstLine);
        if (!match) {
            throw new Error('Invalid first line format');
        }
        const expectedCount = parseInt(match[1], 10);
        const expectedSize = parseInt(match[2], 10);
        const fullMapper = (line: string): string => config.sourcesPathMapper(preTrim(line));
        const mappedPaths = restLines.map(fullMapper).filter((line) => line.length > 0);
        return new DffEntry({ config, expectedCount, expectedSize, mappedPaths });
    }
}

export { DffEntry };
