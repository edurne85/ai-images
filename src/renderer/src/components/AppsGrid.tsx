// docs: https://reactdatagrid.dev/demo/standard
import { DataGrid, type Column, type Row } from 'react-open-source-grid';
import { DbContext, type FoldersTableEntries } from '@renderer/providers/DbProvider';
import { useContext } from 'react';
import { styled } from 'styled-components';

const GridWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const baseColumn: Partial<Column> = {
    pinnable: false,
    width: 200,
};

const idColumn: Partial<Column> = {
    ...baseColumn,
    width: 55,
}

const boolColumn: Partial<Column> = {
    ...baseColumn,
    width: 65,
    sortable: false,
    valueFormatter: (value: boolean): string => (value ? 'Yes' : 'No'),
};

function folderColumn(folders: FoldersTableEntries): Partial<Column> {
    return {
        ...baseColumn,
        sortable: false,
        valueFormatter: (value: number | null): string => {
            if (value === null) {
                return '';
            }
            return folders.parsed[value]?.name ?? `ERR (id: ${value})`;
        },
    };
}
function AppsGrid(): React.JSX.Element {
    const dbContext = useContext(DbContext);

    const columns: Column[] = [
        { field: 'id', headerName: 'ID', ...idColumn },
        { field: 'title', headerName: 'App Title', ...baseColumn },
        { field: 'playId', headerName: 'Google Play ID', ...baseColumn },
        { field: 'installed', headerName: 'Installed', ...boolColumn },
        { field: 'paid', headerName: 'Paid', ...boolColumn },
        { field: 'discarded', headerName: 'Discarded', ...boolColumn },
        { field: 'syncFolder', headerName: 'Sync Folder', ...folderColumn(dbContext.folders) },
        { field: 'notes', headerName: 'Notes', ...baseColumn },
    ];

    const rows = Object.values(dbContext.apps.raw) as Row[];
    return (
        <GridWrapper>
            <DataGrid rows={rows} columns={columns} style={{ flex: 1 }} />
        </GridWrapper>
    );
}

export { AppsGrid };
