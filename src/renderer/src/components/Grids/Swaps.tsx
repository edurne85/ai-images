import { DataGrid, type Column, type Row } from 'react-open-source-grid';
import { DbContext } from '@renderer/providers/DbProvider';
import { useContext } from 'react';
import {
    GridWrapper,
    baseColumn,
    idColumn,
    fileRefColumn,
    style,
    virtualScrollConfig,
    boolColumn,
} from './helpers';
import { useParams } from 'react-router';

function SwapsGrid(): React.JSX.Element {
    const dbContext = useContext(DbContext);
    const { sourceId } = useParams();
    const sourceIdParsed = Number.parseInt(sourceId || '');

    const columns: Column[] = [
        { field: 'id', headerName: 'ID', ...idColumn },
        ...(Number.isNaN(sourceIdParsed)
            ? [{ field: 'source', headerName: 'Source', ...fileRefColumn(dbContext) }]
            : []),
        { field: 'date', headerName: 'Date', ...baseColumn },
        { field: 'fail', headerName: 'Fail', ...boolColumn },
        { field: 'Output', headerName: 'Output file name', ...baseColumn, width: 300 },
    ];

    const allSwaps = Object.values(dbContext.swaps.raw);
    const swapsFiltered =
        !!sourceIdParsed
            ? allSwaps.filter((swap) => swap.source === sourceIdParsed)
            : allSwaps;

    const rows = swapsFiltered as Row[];

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

export { SwapsGrid };
