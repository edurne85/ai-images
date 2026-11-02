import { RecordBase, AppsRecord, Apps, type FoldersData } from '../schema';
import { type DbLink, DbTableLinkBase } from './base';

type AppsRow = {
    ID: number;
    'Display Title': string;
    'Google Play Id': string;
    Installed: number; // 0 or 1
    Paid: number; // 0 or 1
    Discarded: number; // 0 or 1
    'Sync Folder': Nullable<number>; // Assuming this is a foreign key to Folders table
    Notes: string | null;
};
class AppsLink extends DbTableLinkBase<AppsRecord, AppsRow, number> {
    constructor(dbLink: DbLink) {
        super({
            dbLink,
            data: Apps,
            tableName: 'Apps',
            keyFieldName: 'ID',
        });
    }
    objFromRow(row: AppsRow): AppsRecord {
        return new AppsRecord({
            action: 'none',
            id: row['ID'],
            title: row['Display Title'],
            playId: row['Google Play Id'],
            installed: !!row['Installed'],
            paid: !!row['Paid'],
            discarded: !!row['Discarded'],
            syncFolder: row['Sync Folder'],
            notes: row['Notes'] || null,
        });
    }
    getKey(record: AppsRecord): number {
        return record.id;
    }
    async applyUpdates(): Promise<void> {
        const query = `UPDATE Apps SET ID = ?, 'Display Title' = ?, 'Google Play Id' = ?, Installed = ?, Paid = ?, Discarded = ?, 'Sync Folder' = ?, Notes = ? WHERE ID = ?`;
        for (const record of Object.values(this.data).filter((r) => r.action === 'update')) {
            await this.dbLink.run(query, [
                record.id,
                record.title,
                record.playId,
                record.installed ? 1 : 0,
                record.paid ? 1 : 0,
                record.discarded ? 1 : 0,
                record.syncFolder?.id || null,
                record.notes || null,
                record.id, // WHERE clause
            ]);
            record.updated(); // Reset action after update
        }
    }

    checkLinks(folders: FoldersData): void {
        for (const record of Object.values(this.data)) {
            if (typeof record.syncFolder === 'number') {
                if (!folders[record.syncFolder]) {
                    throw new Error(
                        `Invalid syncFolder reference for app ID ${record.id}: Folder ID ${record.syncFolder} does not exist.`
                    );
                }
            } else if (record.syncFolder instanceof RecordBase) {
                if (!folders[record.syncFolder.id]) {
                    throw new Error(
                        `Invalid syncFolder reference for app ID ${record.id}: Folder ID ${record.syncFolder.id} does not exist.`
                    );
                }
            }
        }
    }

    safeRefresh(folders: FoldersData): Promise<Record<number, AppsRecord>> {
        this.checkLinks(folders);
        return this.refresh();
    }
}

export { type AppsRow, AppsLink };
