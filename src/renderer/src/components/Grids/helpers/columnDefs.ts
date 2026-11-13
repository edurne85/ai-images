import { type Column } from 'react-open-source-grid';
import { type DbProvider } from '@renderer/providers/DbProvider';
import { folderFormatter } from './formatters';

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

const boolColumn: Partial<Column> = {
    ...baseColumn,
    width: 65,
    sortable: false,
    valueFormatter: (value: boolean): string => (value ? 'Yes' : 'No'),
};

function folderColumn(dbContext: DbProvider): Partial<Column> {
    return {
        ...baseColumn,
        sortable: false,
        valueFormatter: folderFormatter(dbContext),
    };
}

export { folderColumn, idColumn, boolColumn, baseColumn };
