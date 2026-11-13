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

type SwapsGridProps = {
    sourceId?: number;
};

function SwapsGrid({ sourceId }: SwapsGridProps): React.JSX.Element {
    const dbContext = useContext(DbContext);

    const columns: Column[] = [
        { field: 'id', headerName: 'ID', ...idColumn },
        ...(typeof sourceId === 'number'
            ? []
            : [{ field: 'source', headerName: 'Source', ...fileRefColumn(dbContext) }]),
        { field: 'date', headerName: 'Date', ...baseColumn },
        { field: 'fail', headerName: 'Fail', ...boolColumn },
        { field: 'Output', headerName: 'Output file name', ...baseColumn, width: 300 },
    ];

    const allSwaps = Object.values(dbContext.swaps.raw);
    const swapsFiltered =
        typeof sourceId === 'number'
            ? allSwaps.filter((swap) => swap.source === sourceId)
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
