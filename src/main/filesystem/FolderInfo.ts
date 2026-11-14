import fs from 'fs';
import path from 'path';
import { type Config } from '../config.defs';

const extensionRegEx = new RegExp(/\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$|\.tiff$|\.webp$|\.mp4$/);

function getFilesInFolder(folderPath: string): string[] {
    const files = fs
        .readdirSync(folderPath, { withFileTypes: true, recursive: false })
        .filter((f) => f.isFile() && extensionRegEx.test(f.name))
        .map((f) => f.name);
    return files;
}

function getSourcesInGroup(config: Config, group: string): string[] {
    const pathPrefix = config.sourcesPathMapper(config.sourcesPathPrefix);
    const folderPath = path.join(pathPrefix, group);
    const files = getFilesInFolder(folderPath);
    return files;
}

function getAllSources(config: Config): Record<string, string[]> {
    const mappedBasePath = config.sourcesPathMapper(config.sourcesPathPrefix);
    const groups = fs
        .readdirSync(mappedBasePath, { withFileTypes: true, recursive: false })
        .filter((f) => f.isDirectory())
        .map((f) => f.name);
    const result = {};
    for (const group of groups) {
        result[group] = getSourcesInGroup(config, group);
    }
    return result;
}

export { getFilesInFolder, getSourcesInGroup, getAllSources };
