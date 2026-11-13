import { type DbProvider } from '@renderer/providers/DbProvider';
import { TagsRecord, type TagRecordEntry } from '../../../../../schema';

type Formatter<T> = (value: T) => string;

function folderFormatter(dbContext: DbProvider): Formatter<number | null> {
    return (value: number | null): string => {
        if (value === null) {
            return '';
        }
        return dbContext.folders.parsed[value]?.name ?? `ERR (id: ${value})`;
    };
}

function fileRefFormatter(dbContext: DbProvider): Formatter<number | null> {
    return (value: number | null): string => {
        if (value === null) {
            return '';
        }
        return dbContext.files.parsed[value]?.name ?? `ERR (id: ${value})`;
    };
}

function tagRecordEntryToString(dbContext: DbProvider, tag: TagRecordEntry): string {
    if (tag instanceof TagsRecord) {
        return tag.tag;
    }
    if (typeof tag === 'string') {
        return tag;
    }
    if (typeof tag === 'number') {
        const tags = dbContext.tags.raw;
        return tags[tag] ? tags[tag].tag : `ERR (id: ${tag})`;
    }
    throw new Error('Type system failure: unreachable code reached');
}

function tagsFromatter(dbContext: DbProvider): Formatter<TagRecordEntry[]> {
    return (value: TagRecordEntry[]): string =>
        value.map((tag) => tagRecordEntryToString(dbContext, tag)).join(', ');
}

export { folderFormatter, fileRefFormatter, tagsFromatter };
