import { RecordBase, Serializable, type RecordBaseBuilder } from './base';

type FoldersRawBuilder = RecordBaseBuilder & {
    id: number;
    name: string;
    sync: boolean;
    notes: string | null;
};

class FoldersRecord extends RecordBase implements Serializable<FoldersRawBuilder> {
    #id: number;
    #name: string;
    #sync: boolean;
    #notes: string | null;

    constructor({ id, name, sync = false, notes = null, ...rest }: FoldersRawBuilder) {
        super(rest);
        this.#id = id;
        this.#name = name;
        this.#sync = sync;
        this.#notes = notes;
    }

    get id(): number {
        return this.#id;
    }

    get name(): string {
        return this.#name;
    }

    set name(value: string) {
        this.#name = value;
        this.action = 'update';
    }

    get sync(): boolean {
        return this.#sync;
    }

    set sync(value: boolean) {
        this.#sync = value;
        this.action = 'update';
    }

    get notes(): string | null {
        return this.#notes;
    }

    set notes(value: string | null) {
        this.#notes = value;
        this.action = 'update';
    }

    get $serialized(): FoldersRawBuilder {
        return {
            ...super.$serialized,
            id: this.#id,
            name: this.#name,
            sync: this.#sync,
            notes: this.#notes,
        };
    }
}

const Folders: Record<FoldersRawBuilder['id'], FoldersRecord> = {};

type FoldersData = typeof Folders;

type FoldersRecordEntry = FoldersRecord | number;

function getFoldersRecord(entry: FoldersRecordEntry): FoldersRecord {
    if (entry instanceof FoldersRecord) {
        return entry;
    }
    const folderRecord = Folders[entry];
    if (!folderRecord) {
        throw new Error(`Folder with id ${entry} does not exist.`);
    }
    return folderRecord;
}

export {
    type FoldersRawBuilder,
    FoldersRecord,
    Folders,
    type FoldersData,
    type FoldersRecordEntry,
    getFoldersRecord,
};
