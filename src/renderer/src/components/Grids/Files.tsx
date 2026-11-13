import { DataGrid, type Column, type Row } from 'react-open-source-grid';
import { DbContext } from '@renderer/providers/DbProvider';
import { useContext } from 'react';
import {
    GridWrapper,
    baseColumn,
    idColumn,
    countColumn,
    folderColumn,
    style,
    virtualScrollConfig,
} from './helpers';

import { type SwapsRawBuilder } from 'src/schema';
import { tagsColumn } from './helpers/columnDefs';

type FilesGridProps = {
    folderId?: number;
};

function FilesGrid({ folderId }: FilesGridProps): React.JSX.Element {
    const dbContext = useContext(DbContext);

    const columns: Column[] = [
        { field: 'id', headerName: 'ID', ...idColumn, width: 115 },
        ...(typeof folderId === 'number'
            ? []
            : [{ field: 'folder', headerName: 'Folder', ...folderColumn(dbContext) }]),
        { field: 'name', headerName: 'File name', ...baseColumn, width: 300 },
        { field: 'notes', headerName: 'Notes', ...baseColumn, width: 300 },
        { field: 'swaps', headerName: 'Swaps', ...countColumn },
        { field: 'tags', headerName: 'Tags', ...tagsColumn(dbContext) },
    ];

    const allFiles = Object.values(dbContext.files.raw);
    const filesFiltered =
        typeof folderId === 'number'
            ? allFiles.filter((file) => file.folder === folderId)
            : allFiles;

    const rows = filesFiltered as Row[];

    const swaps = Object.values(dbContext.swaps.raw) as (SwapsRawBuilder & {})[];

    for (const row of rows) {
        let swapsCount = 0;
        for (const swap of swaps) {
            if (swap.source === row.id) {
                swapsCount++;
            }
        }
        row.swaps = swapsCount;
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

export { FilesGrid };
