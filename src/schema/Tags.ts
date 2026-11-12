import { RecordBase, type RecordBaseBuilder } from './base';

type TagsRawBuilder = RecordBaseBuilder & {
    id: number;
    tag: string;
};

class TagsRecord extends RecordBase {
    #id: number;
    #tag: string;

    constructor({ id, tag, ...rest }: TagsRawBuilder) {
        super(rest);
        this.#id = id;
        this.#tag = tag;
    }

    get id(): number {
        return this.#id;
    }

    get tag(): string {
        return this.#tag;
    }

    set tag(value: string) {
        this.#tag = value;
        this.action = 'update';
    }
}

const Tags: Record<TagsRecord['id'], TagsRecord> = {};
const TagsByTag: Record<TagsRecord['tag'], TagsRecord> = {};

type TagsData = typeof Tags;
type TagsByTagData = typeof TagsByTag;

type TagRecordEntry = TagsRecord | number | string;

function getTagRecord(entry: TagRecordEntry): TagsRecord {
    if (entry instanceof TagsRecord) {
        return entry;
    }
    if (typeof entry === 'number') {
        const tagRecord = Tags[entry];
        if (!tagRecord) {
            throw new Error(`Tag with id ${entry} does not exist.`);
        }
        return tagRecord;
    }
    if (typeof entry === 'string') {
        const tagRecord = TagsByTag[entry];
        if (!tagRecord) {
            throw new Error(`Tag "${entry}" does not exist.`);
        }
        return tagRecord;
    }
    throw new Error(`Invalid tag entry: ${entry}`);
}

export {
    type TagsRawBuilder,
    TagsRecord,
    Tags,
    TagsByTag,
    type TagsData,
    type TagsByTagData,
    type TagRecordEntry,
    getTagRecord,
};
