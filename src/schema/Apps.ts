import { RecordBase, type Serializable, type RecordBaseBuilder } from './base';
import { FoldersRecord, type FoldersRecordEntry, getFoldersRecord } from './Folders';

type AppsRawBuilder = RecordBaseBuilder & {
    id: number;
    title: string;
    playId: string;
    installed: boolean;
    paid: boolean;
    discarded: boolean;
    syncFolder: Nullable<FoldersRecordEntry>;
    notes: string | null;
};

class AppsRecord extends RecordBase implements Serializable<AppsRawBuilder> {
    #id: number;
    #title: string;
    #playId: string;
    #installed: boolean;
    #paid: boolean;
    #discarded: boolean;
    #syncFolder: Nullable<FoldersRecord>;
    #notes: string | null;

    constructor({
        id,
        title,
        playId,
        installed = false,
        paid = false,
        discarded = false,
        syncFolder = null,
        notes = null,
        ...rest
    }: AppsRawBuilder) {
        super(rest);
        this.#id = id;
        this.#title = title;
        this.#playId = playId;
        this.#installed = installed;
        this.#paid = paid;
        this.#discarded = discarded;
        this.#syncFolder = syncFolder ? getFoldersRecord(syncFolder) : null;
        this.#notes = notes;
    }

    get id(): number {
        return this.#id;
    }

    get title(): string {
        return this.#title;
    }

    set title(value: string) {
        this.#title = value;
        this.action = 'update';
    }

    get playId(): string {
        return this.#playId;
    }

    set playId(value: string) {
        this.#playId = value;
        this.action = 'update';
    }

    get installed(): boolean {
        return this.#installed;
    }

    set installed(value: boolean) {
        this.#installed = value;
        this.action = 'update';
    }

    get paid(): boolean {
        return this.#paid;
    }

    set paid(value: boolean) {
        this.#paid = value;
        this.action = 'update';
    }

    get discarded(): boolean {
        return this.#discarded;
    }

    set discarded(value: boolean) {
        this.#discarded = value;
        this.action = 'update';
    }

    get syncFolder(): Nullable<FoldersRecord> {
        return this.#syncFolder;
    }

    set syncFolder(value: Nullable<FoldersRecordEntry>) {
        if (value === null) {
            this.#syncFolder = null;
            this.action = 'update';
            return;
        }
        const syncFolderRecord = getFoldersRecord(value);
        if (syncFolderRecord.action === 'delete') {
            throw new Error(`Cannot set syncFolder to a folder marked for deletion.`);
        } else if (syncFolderRecord.action === 'invalid') {
            throw new Error(`Cannot set syncFolder to a folder marked as invalid.`);
        }
        this.#syncFolder = syncFolderRecord;
        this.action = 'update';
    }

    get notes(): string | null {
        return this.#notes;
    }

    set notes(value: string | null) {
        this.#notes = value;
        this.action = 'update';
    }

    get $serialized(): AppsRawBuilder {
        return {
            ...super.$serialized,
            id: this.#id,
            title: this.#title,
            playId: this.#playId,
            installed: this.#installed,
            paid: this.#paid,
            discarded: this.#discarded,
            syncFolder: this.#syncFolder?.id || null,
            notes: this.#notes,
        };
    }
}

const Apps: Record<AppsRawBuilder['id'], AppsRecord> = {};

type AppsData = typeof Apps;

type AppsRecordEntry = AppsRecord | number;

function getAppsRecord(entry: AppsRecordEntry): AppsRecord {
    if (entry instanceof AppsRecord) {
        return entry;
    }
    const appRecord = Apps[entry];
    if (!appRecord) {
        throw new Error(`App with id ${entry} does not exist.`);
    }
    return appRecord;
}

export {
    type AppsRawBuilder,
    AppsRecord,
    Apps,
    type AppsData,
    type AppsRecordEntry,
    getAppsRecord,
};
