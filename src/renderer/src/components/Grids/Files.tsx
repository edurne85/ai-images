import { DataGrid, type Column, type Row } from 'react-open-source-grid';
import { DbContext } from '@renderer/providers/DbProvider';
import { useContext } from 'react';
import { Link, useParams } from "react-router";
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

function FilesGrid(): React.JSX.Element {
    const dbContext = useContext(DbContext);
    const { folderId } = useParams();
    const folderIdParsed = Number.parseInt(folderId || '');

    const columns: Column[] = [
        { field: 'id', headerName: 'ID', ...idColumn, width: 115 },
        ...(Number.isNaN(folderIdParsed)
            ? [{ field: 'folder', headerName: 'Folder', ...folderColumn(dbContext) }]
            : []),
        { field: 'name', headerName: 'File name', ...baseColumn, width: 300 },
        { field: 'notes', headerName: 'Notes', ...baseColumn, width: 300 },
        {
            field: 'swaps',
            headerName: 'Swaps',
            ...countColumn,
            renderCell: (row: Row) => (
                row.swaps > 0
                ? <Link to={`/swaps/${row.id}`}>{row.swaps}</Link>
                : <></>
            ),
        },
        { field: 'tags', headerName: 'Tags', ...tagsColumn(dbContext) },
    ];

    const allFiles = Object.values(dbContext.files.raw);
    const filesFiltered =
        !!folderIdParsed 
            ? allFiles.filter((file) => file.folder === folderIdParsed)
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
