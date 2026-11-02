import { RecordBase, SwapsRecord, Swaps, type FilesData } from '../schema';
import { type DbLink, DbTableLinkBase } from './base';

type SwapsRow = {
    ID: number;
    Source: number;
    Date: SqlSimpleDate;
    File: string;
    Fail: 0 | 1;
};

class SwapsLink extends DbTableLinkBase<SwapsRecord, SwapsRow, number> {
    constructor(dbLink: DbLink) {
        super({
            dbLink,
            data: Swaps,
            tableName: 'Swaps',
            keyFieldName: 'ID',
        });
    }

    objFromRow(row: SwapsRow): SwapsRecord {
        return new SwapsRecord({
            action: 'none',
            id: row.ID,
            source: row.Source,
            date: row.Date,
            output: row.File,
            fail: !!row.Fail,
        });
    }

    getKey(record: SwapsRecord): SwapsRecord['id'] {
        return record.id;
    }

    async applyUpdates(): Promise<void> {
        const query = `UPDATE Swaps SET ID = ?, Source = ?, Date = ?, File = ?, Fail = ? WHERE ID = ?`;
        for (const record of Object.values(this.data).filter((r) => r.action === 'update')) {
            await this.dbLink.run(query, [
                record.id,
                record.source.id,
                record.date,
                record.output,
                record.fail ? 1 : 0,
                record.id, // WHERE clause
            ]);
            record.updated(); // Reset action after update
        }
    }

    async applyInsertions(): Promise<void> {
        const query = `INSERT INTO Swaps (ID, Source, Date, File, Fail) VALUES (?, ?, ?, ?, ?)`;
        for (const record of Object.values(this.data).filter((r) => r.action === 'insert')) {
            await this.dbLink.run(query, [
                record.id,
                record.source.id,
                record.date,
                record.output,
                record.fail ? 1 : 0,
            ]);
            record.updated(); // Reset action after insertion
        }
    }

    checkLinks(files: FilesData): void {
        for (const record of Object.values(this.data)) {
            if (typeof record.source === 'number') {
                if (!files[record.source]) {
                    throw new Error(
                        `File with id ${record.source} does not exist for swap with id ${record.id}.`
                    );
                }
            } else if (record.source instanceof RecordBase) {
                if (!files[record.source.id]) {
                    throw new Error(
                        `File with id ${record.source.id} does not exist for swap with id ${record.id}.`
                    );
                }
            }
        }
    }

    async refreshData(
        newData: Record<number, SwapsRecord>,
        files: FilesData
    ): Promise<Record<number, SwapsRecord>> {
        this.data = newData;
        this.checkLinks(files);
        return await this.refresh();
    }
}

export { type SwapsRow, SwapsLink };
