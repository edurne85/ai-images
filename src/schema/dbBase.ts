import { RecordBase, clearRecords } from './base';
import { type open } from 'sqlite';

type DbLink = Awaited<ReturnType<typeof open>>;

type DbTableLinkBuilder<T extends RecordBase, K extends Key = Key> = {
    dbLink: DbLink;
    data?: Record<K, T>;
    tableName: string;
    keyFieldName: string;
};
abstract class DbTableLinkBase<T extends RecordBase, Row, K extends Key = Key> {
    #dbLink: DbLink;
    #data: Record<K, T>;
    #tableName: string;
    #keyFieldName: string;
    constructor({
        dbLink,
        data = {} as Record<K, T>,
        tableName,
        keyFieldName = 'ID',
    }: DbTableLinkBuilder<T, K>) {
        this.#dbLink = dbLink;
        this.#data = data;
        this.#tableName = tableName;
        this.#keyFieldName = keyFieldName;
    }
    get dbLink(): DbLink {
        return this.#dbLink;
    }
    get data(): Record<K, T> {
        return this.#data;
    }
    abstract objFromRow(row: Row): T;
    abstract getKey(record: T): K;
    async dbFetchEntry(key: K): Promise<T | null> {
        const row = await this.dbLink?.get<Row>(
            `SELECT * FROM ${this.#tableName} WHERE ${this.#keyFieldName} = ?`,
            key
        );
        if (row) {
            const record = this.objFromRow(row);
            this.#data[key] = record;
            return record;
        } else {
            return null;
        }
    }

    async dbFetchAll(): Promise<Record<K, T>> {
        clearRecords(this.#data);
        await this.dbLink.each<Row>(`SELECT * FROM ${this.#tableName}`, (err, row) => {
            if (err) {
                throw err;
            }
            const record = this.objFromRow(row);
            this.#data[this.getKey(record)] = record;
        });
        return this.#data;
    }

    abstract applyUpdates(): Promise<void>;
    async applyDeletions(): Promise<void> {
        const entriesToDelete = Object.values(this.#data)
            .map((r) => r as T)
            .filter((record) => record.action === 'delete');
        for (const record of entriesToDelete) {
            const key = this.getKey(record);
            await this.dbLink?.run(
                `DELETE FROM ${this.#tableName} WHERE ${this.#keyFieldName} = ?`,
                key
            );
            delete this.#data[key];
        }
    }
    getEntry(key: K): T | null {
        return this.#data[key] ?? this.dbFetchEntry(key);
    }

    // Subclasses should expose a method that checks any foreign constraints before calling this.
    protected refresh(): Promise<Record<K, T>> {
        this.applyUpdates();
        this.applyDeletions();
        return this.dbFetchAll();
    }
}

export { type DbLink, DbTableLinkBase };
