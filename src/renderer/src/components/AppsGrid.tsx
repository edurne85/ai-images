// docs: https://reactdatagrid.dev/demo/standard
import { DataGrid, type Column, type Row } from 'react-open-source-grid';
import { DbContext } from '@renderer/providers/DbProvider';
import { useContext } from 'react';
import { GridWrapper, baseColumn, boolColumn, folderColumn, idColumn } from './Grids';

function AppsGrid(): React.JSX.Element {
    const dbContext = useContext(DbContext);

    const columns: Column[] = [
        { field: 'id', headerName: 'ID', ...idColumn },
        { field: 'title', headerName: 'App Title', ...baseColumn },
        { field: 'playId', headerName: 'Google Play ID', ...baseColumn },
        { field: 'installed', headerName: 'Installed', ...boolColumn },
        { field: 'paid', headerName: 'Paid', ...boolColumn },
        { field: 'discarded', headerName: 'Discarded', ...boolColumn },
        { field: 'syncFolder', headerName: 'Sync Folder', ...folderColumn(dbContext) },
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
