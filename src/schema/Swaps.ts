import { RecordBase, type Serializable, type RecordBaseBuilder } from './base';
import { FilesRecord, type FilesRecordEntry, getFilesRecord } from './Files';

type SwapsRawBuilder = RecordBaseBuilder & {
    id: number;
    source: FilesRecordEntry;
    date: SqlSimpleDate;
    output: string;
    fail?: boolean;
};

class SwapsRecord extends RecordBase implements Serializable<SwapsRawBuilder> {
    #id: number;
    #source: FilesRecord;
    #date: SqlSimpleDate;
    #output: string;
    #fail: boolean;

    constructor({ id, source, date, output, fail = false, ...rest }: SwapsRawBuilder) {
        super(rest);
        this.#id = id;
        this.#source = getFilesRecord(source);
        this.#date = date;
        this.#output = output;
        this.#fail = fail;
    }

    get id(): number {
        return this.#id;
    }

    get source(): FilesRecord {
        return this.#source;
    }

    set source(value: FilesRecordEntry) {
        const sourceRecord = getFilesRecord(value);
        if (sourceRecord.action === 'delete') {
            throw new Error(`Cannot set source to a file marked for deletion.`);
        } else if (sourceRecord.action === 'invalid') {
            throw new Error(`Cannot set source to a file marked as invalid.`);
        }
        this.#source = sourceRecord;
        this.action = 'update';
    }

    get date(): SqlSimpleDate {
        return this.#date;
    }

    set date(value: SqlSimpleDate) {
        const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
        const matches = dateRegex.exec(value); // This line seems unnecessary, but it can be used for debugging or logging if needed.
        if (!matches || matches.length !== 4) {
            throw new Error(`Invalid date format. Expected YYYY-MM-DD.`);
        }
        const month = parseInt(matches[2], 10);
        const day = parseInt(matches[3], 10);
        if (month < 1 || month > 12) {
            throw new Error(`Invalid month in date. Expected 01-12.`);
        }
        if (day < 1 || day > 31) {
            throw new Error(`Invalid day in date. Expected 01-31.`);
        }
        this.#date = value;
        this.action = 'update';
    }

    get output(): string {
        return this.#output;
    }

    set output(value: string) {
        this.#output = value;
        this.action = 'update';
    }

    get fail(): boolean {
        return this.#fail;
    }

    set fail(value: boolean) {
        this.#fail = value;
        this.action = 'update';
    }

    get $key(): number {
        return this.#id;
    }

    get $serialized(): SwapsRawBuilder {
        return {
            ...super.$serialized,
            id: this.#id,
            source: this.#source.$key,
            date: this.#date,
            output: this.#output,
            fail: this.#fail,
        };
    }
}

const Swaps: Record<SwapsRecord['id'], SwapsRecord> = {};

type SwapsData = typeof Swaps;

type SwapsRecordEntry = SwapsRecord | number;

function getSwapsRecord(entry: SwapsRecordEntry): SwapsRecord {
    if (entry instanceof SwapsRecord) {
        return entry;
    }
    const swapRecord = Swaps[entry];
    if (!swapRecord) {
        throw new Error(`Swap with id ${entry} does not exist.`);
    }
    return swapRecord;
}

export {
    type SwapsRawBuilder,
    SwapsRecord,
    Swaps,
    type SwapsData,
    type SwapsRecordEntry,
    getSwapsRecord,
};
