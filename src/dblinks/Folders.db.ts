import { FoldersRecord, Folders } from '../schema';
import { type DbLink, DbTableLinkBase } from './base';

type FoldersRow = {
    ID: number;
    Source: string;
    Sync: number; // 0 or 1
    Notes: string | null;
};

class FoldersLink extends DbTableLinkBase<FoldersRecord, FoldersRow, number> {
    constructor(dbLink: DbLink) {
        super({
            dbLink,
            data: Folders,
            tableName: 'SourceFolders',
            keyFieldName: 'ID',
        });
    }

    objFromRow(row: FoldersRow): FoldersRecord {
        return new FoldersRecord({
            action: 'none',
            id: row['ID'],
            name: row['Source'],
            sync: !!row['Sync'],
            notes: row['Notes'] || null,
        });
    }

    getKey(record: FoldersRecord): number {
        return record.id;
    }

    async applyUpdates(): Promise<void> {
        const query = `UPDATE SourceFolders SET ID = ?, Source = ?, Sync = ?, Notes = ? WHERE ID = ?`;
        for (const record of Object.values(this.data).filter((r) => r.action === 'update')) {
            await this.dbLink.run(query, [
                record.id,
                record.name,
                record.sync ? 1 : 0,
                record.notes || null,
                record.id, // WHERE clause
            ]);
            record.updated(); // Reset action after update
        }
    }

    safeRefresh(): Promise<Record<number, FoldersRecord>> {
        return this.refresh();
    }
}

export { type FoldersRow, FoldersLink };
