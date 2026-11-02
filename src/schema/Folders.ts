import { RecordBase, type RecordPendingAction } from './base';

type FoldersRawBuilder = {
    action: RecordPendingAction;
    id: number;
    name: string;
    sync: boolean;
    notes: string | null;
};

class FoldersRecord extends RecordBase {
    #id: number;
    #name: string;
    #sync: boolean;
    #notes: string | null;

    constructor({ action = 'none', id, name, sync = false, notes = null }: FoldersRawBuilder) {
        super(action);
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

export { FoldersRecord, Folders, type FoldersData, type FoldersRecordEntry, getFoldersRecord };
