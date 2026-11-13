import { type Column } from 'react-open-source-grid';
import { type DbProvider } from '@renderer/providers/DbProvider';
import { fileRefFormatter, folderFormatter, tagsFromatter } from './formatters';

const baseColumn: Partial<Column> = {
    pinnable: false,
    width: 200,
    cellStyle: {
        fontFamily: 'var(--font-family)',
    },
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    tooltipValueGetter: (_: any, value: any): string => `${value || ''}`,
};

const idColumn: Partial<Column> = {
    ...baseColumn,
    width: 55,
};

const countColumn: Partial<Column> = {
    ...baseColumn,
    width: 70,
    valueFormatter: (value: number): string => `${value || ''}`,
};

const boolColumn: Partial<Column> = {
    ...baseColumn,
    width: 65,
    sortable: false,
    valueFormatter: (value: boolean): string => (value ? 'Yes' : 'No'),
};

function folderColumn(dbContext: DbProvider): Partial<Column> {
    return {
        ...baseColumn,
        width: 150,
        sortable: false,
        valueFormatter: folderFormatter(dbContext),
    };
}

function fileRefColumn(dbContext: DbProvider): Partial<Column> {
    return {
        ...baseColumn,
        width: 150,
        sortable: false,
        valueFormatter: fileRefFormatter(dbContext),
    };
}

function tagsColumn(dbContext: DbProvider): Partial<Column> {
    return {
        ...baseColumn,
        sortable: false,
        valueFormatter: tagsFromatter(dbContext),
    };
}

export { folderColumn, idColumn, countColumn, boolColumn, baseColumn, fileRefColumn, tagsColumn };
