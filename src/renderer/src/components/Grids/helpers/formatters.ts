import { type DbProvider } from '@renderer/providers/DbProvider';

type Formatter<T> = (value: T) => string;

function folderFormatter(dbContext: DbProvider): Formatter<number | null> {
    return (value: number | null): string => {
        if (value === null) {
            return '';
        }
        return dbContext.folders.parsed[value]?.name ?? `ERR (id: ${value})`;
    };
}

export { folderFormatter };
