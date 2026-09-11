import { RecordBase, type RecordPendingAction } from './base';

type FoldersRawBuilder = {
    action: RecordPendingAction;
    id: number;
    name: string;
    sync: boolean;
    notes: string;
};

class FoldersRecord extends RecordBase {
    #id: number;
    #name: string;
    #sync: boolean;
    #notes: string;

    constructor({ action = 'none', id, name, sync = false, notes = '' }: FoldersRawBuilder) {
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

    get notes(): string {
        return this.#notes;
    }

    set notes(value: string) {
        this.#notes = value;
        this.action = 'update';
    }
}

const Folders: Record<FoldersRawBuilder['id'], FoldersRecord> = {};

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

export { FoldersRecord, Folders, type FoldersRecordEntry, getFoldersRecord };
