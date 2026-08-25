import { RecordBase, type RecordPendingAction } from "./base";

type TagsRawBuilder = {
  action: RecordPendingAction;
  id: number;
  tag: string;
};

class TagsRecord extends RecordBase {
  #id: number;
  #tag: string;

  constructor({ action = "none", id, tag }: TagsRawBuilder) {
    super(action);
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
    this.action = "update";
  }
}

const Tags: Record<TagsRecord["id"], TagsRecord> = {};
const TagsByTag: Record<TagsRecord["tag"], TagsRecord> = {};

export { TagsRecord, Tags, TagsByTag };
