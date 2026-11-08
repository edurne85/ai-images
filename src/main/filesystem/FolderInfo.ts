import fs from 'fs';
import path from 'path';
import { type Config } from '../config.defs';

function getFilesInFolder(folderPath: string): string[] {
    const files = fs
        .readdirSync(folderPath, { withFileTypes: true, recursive: false })
        .filter((f) => f.isFile())
        .map((f) => f.name);
    return files;
}

function getSourcesInGroup(config: Config, group: string): string[] {
    const folderRawPath = path.join(config.sourcesPathPrefix, group);
    const folderMappedPath = config.sourcesPathMapper(folderRawPath);
    const files = getFilesInFolder(folderMappedPath);
    return files;
}

function getAllSources(config: Config): Record<string, string[]> {
    const mappedBasePath = config.sourcesPathMapper(config.sourcesPathPrefix);
    const groups = fs
        .readdirSync(mappedBasePath, { withFileTypes: true, recursive: false })
        .filter((f) => f.isDirectory)
        .map((f) => f.name);
    const result = {};
    for (const group of groups) {
        result[group] = getSourcesInGroup(config, group);
    }
    return result;
}

export { getFilesInFolder, getSourcesInGroup, getAllSources };
