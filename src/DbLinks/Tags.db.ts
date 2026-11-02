import { TagsRecord, Tags, type TagsData } from '../schema';
import { type DbLink, DbTableLinkBase } from './base';

type TagsRow = {
    ID: number;
    Tag: string;
};

class TagsLink extends DbTableLinkBase<TagsRecord, TagsRow, number> {
    constructor(dbLink: DbLink) {
        super({
            dbLink,
            data: Tags,
            tableName: 'Tags',
            keyFieldName: 'ID',
        });
    }

    objFromRow(row: TagsRow): TagsRecord {
        return new TagsRecord({ action: 'none', id: row.ID, tag: row.Tag });
    }

    getKey(record: TagsRecord): TagsRecord['id'] {
        return record.id;
    }

    async applyUpdates(): Promise<void> {
        const query = `UPDATE Tags SET ID = ?, Tag = ? WHERE ID = ?`;
        for (const record of Object.values(this.data).filter((r) => r.action === 'update')) {
            await this.dbLink.run(query, [record.id, record.tag, record.id]);
            record.updated(); // Reset action after update
        }
    }

    safeRefresh(): Promise<TagsData> {
        return this.refresh();
    }
}

export { type TagsRow, TagsLink };
