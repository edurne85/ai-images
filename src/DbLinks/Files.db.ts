import { RecordBase, FilesRecord, Files, FoldersData } from '../schema';
import { type DbLink, DbTableLinkBase } from './base';

// TODO: Implement tag links!
type FilesRow = {
    ID: number;
    Folder: number;
    File: string;
    Notes: string | null;
};

class FilesLink extends DbTableLinkBase<FilesRecord, FilesRow, number> {
    constructor(dbLink: DbLink) {
        super({
            dbLink,
            data: Files,
            tableName: 'SourceFiles',
            keyFieldName: 'ID',
        });
    }

    objFromRow(row: FilesRow): FilesRecord {
        return new FilesRecord({
            action: 'none',
            id: row['ID'],
            folder: row['Folder'],
            name: row['File'],
            notes: row['Notes'] || null,
            tags: [],
        });
    }

    getKey(record: FilesRecord): number {
        return record.id;
    }

    async applyUpdates(): Promise<void> {
        const query = `UPDATE SourceFiles SET ID = ?, Folder = ?, File = ?, Notes = ? WHERE ID = ?`;
        for (const record of Object.values(this.data).filter((r) => r.action === 'update')) {
            await this.dbLink.run(query, [
                record.id,
                record.folder.id,
                record.name,
                record.notes,
                record.id,
            ]);
            record.updated(); // Reset action after update
        }
    }

    async applyInsertions(): Promise<void> {
        const query = `INSERT INTO SourceFiles (ID, Folder, File, Notes) VALUES (?, ?, ?, ?)`;
        for (const record of Object.values(this.data).filter((r) => r.action === 'insert')) {
            await this.dbLink.run(query, [record.id, record.folder.id, record.name, record.notes]);
            record.updated(); // Reset action after insertion
        }
    }

    checkFolderLinks(folders: FoldersData): void {
        for (const record of Object.values(this.data)) {
            // Checking folder link: [SourceFiles].[Folder] -> [SourceFolders].[ID]
            if (typeof record.folder === 'number') {
                if (!folders[record.folder]) {
                    throw new Error(
                        `Folder with id ${record.folder} does not exist for file with id ${record.id}.`
                    );
                }
            } else if (record.folder instanceof RecordBase) {
                if (!folders[record.folder.id]) {
                    throw new Error(
                        `Folder with id ${record.folder.id} does not exist for file with id ${record.id}.`
                    );
                }
            }
        }
    }

    async safeRefresh(folders: FoldersData): Promise<Record<number, FilesRecord>> {
        this.checkFolderLinks(folders);
        // TODO: Implement checks for tags (via SourceFileTags doubly-linked table).
        return await this.refresh();
    }

    async refreshData(
        newData: Record<number, FilesRecord>,
        folders: FoldersData
    ): Promise<Record<number, FilesRecord>> {
        this.data = newData;
        return await this.safeRefresh(folders);
    }
}

export { type FilesRow, FilesLink };
