import { DataGrid, type Column, type Row } from 'react-open-source-grid';
import { DbContext } from '@renderer/providers/DbProvider';
import { useContext } from 'react';
import {
    GridWrapper,
    baseColumn,
    idColumn,
    countColumn,
    boolColumn,
    style,
    virtualScrollConfig,
} from './helpers';
import { type FilesRawBuilder } from 'src/schema';

function FoldersGrid(): React.JSX.Element {
    const dbContext = useContext(DbContext);

    const columns: Column[] = [
        { field: 'id', headerName: 'ID', ...idColumn },
        { field: 'name', headerName: 'Folder name', ...baseColumn },
        { field: 'sync', headerName: "Sync'd", ...boolColumn },
        { field: 'notes', headerName: 'Notes', ...baseColumn },
        { field: 'filesCount', headerName: 'Files', ...countColumn },
    ];

    const rows = Object.values(dbContext.folders.raw) as Row[];
    const files = Object.values(dbContext.files.raw) as FilesRawBuilder[];

    for (const row of rows) {
        let filesCount = 0;
        for (const file of files) {
            if (file.folder === row.id) {
                filesCount++;
            }
        }
        row.filesCount = filesCount;
    }

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

export { FoldersGrid };
