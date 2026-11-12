// docs: https://reactdatagrid.dev/demo/standard
import { DataGrid, type Column, type Row } from 'react-open-source-grid';
import * as $schema from '../../../schema';

const baseColumn: Partial<Column> = {
    pinnable: false,
    width: 200,
};

const boolColumn: Partial<Column> = {
    ...baseColumn,
    width: 65,
    sortable: false,
};

const folderColumn: Partial<Column> = {
    ...baseColumn,
    sortable: false,
    valueFormatter: (value: number | null): string => {
        if (value === null) {
            return '';
        }
        return $schema.Folders[value]?.name ?? `ERR (id: ${value})`;
    },
};

const columns: Column[] = [
    // { field: 'id', headerName: 'ID', hide: true },
    { field: 'title', headerName: 'App Title', ...baseColumn },
    { field: 'playId', headerName: 'Google Play ID', ...baseColumn },
    { field: 'installed', headerName: 'Installed', ...boolColumn },
    { field: 'paid', headerName: 'Paid', ...boolColumn },
    { field: 'discarded', headerName: 'Discarded', ...boolColumn },
    { field: 'syncFolder', headerName: 'Sync Folder', ...folderColumn },
    { field: 'notes', headerName: 'Notes', ...baseColumn },
];
function AppsGrid(): React.JSX.Element {
    if (Object.keys($schema.Folders)) {
        window.api.db.getFolders();
    }
    const rows = window.api.db.getApps() as Row[];
    return <DataGrid rows={rows} columns={columns} />;
}

export { AppsGrid };
