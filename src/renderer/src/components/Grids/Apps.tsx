import { DataGrid, type Column, type Row } from 'react-open-source-grid';
import { DbContext } from '@renderer/providers/DbProvider';
import { useContext } from 'react';
import {
    GridWrapper,
    baseColumn,
    idColumn,
    boolColumn,
    folderColumn,
    style,
    virtualScrollConfig,
} from './helpers';

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
            <DataGrid
                {...{ rows, columns, style, virtualScrollConfig }}
                hideToolbar={true}
                densityMode="ultraCompact"
            />
        </GridWrapper>
    );
}

export { AppsGrid };
