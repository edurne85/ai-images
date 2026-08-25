import { RecordBase, type RecordPendingAction } from "./base";
import { FoldersRecord, Folders, FoldersRecordEntry } from "./Folders";
import { TagsRecord, Tags, TagsByTag } from "./Tags";

type TagEntry = TagsRecord | number | string;

function getTagRecord(tag: TagEntry): TagsRecord {
  if (tag instanceof TagsRecord) {
    return tag;
  }
  if (typeof tag === "number") {
    const tagRecord = Tags[tag];
    if (!tagRecord) {
      throw new Error(`Tag with id ${tag} does not exist.`);
    }
    return tagRecord;
  }
  if (typeof tag === "string") {
    const tagRecord = TagsByTag[tag];
    if (!tagRecord) {
      throw new Error(`Tag "${tag}" does not exist.`);
    }
    return tagRecord;
  }
  throw new Error(`Invalid tag entry: ${tag}`);
}

type FilesRawBuilder = {
  action: RecordPendingAction;
  id: number;
  folder: number;
  name: string;
  notes: string;
  tags: TagEntry[];
};

class FilesRecord extends RecordBase {
  #id: number;
  #folder: number;
  #name: string;
  #notes: string;
  #tags: Set<TagsRecord>;

  constructor({
    action = "none",
    id,
    folder,
    name,
    notes = "",
    tags = [],
  }: FilesRawBuilder) {
    super(action);
    this.#id = id;
    this.#folder = folder;
    this.#name = name;
    this.#notes = notes;
    this.#tags = new Set(tags.map(getTagRecord));
  }

  get id(): number {
    return this.#id;
  }

  get folder(): FoldersRecord {
    const folderRecord = Folders[this.#folder];
    if (!folderRecord) {
      throw new Error(`Folder with id ${this.#folder} does not exist.`);
    }
    return folderRecord;
  }

  set folder(value: FoldersRecordEntry) {
    if (value instanceof FoldersRecord) {
      if (value.action === "delete") {
        throw new Error(`Cannot set folder to a folder marked for deletion.`);
      } else if (value.action === "invalid") {
        throw new Error(`Cannot set folder to a folder marked as invalid.`);
      }
      this.#folder = value.id;
      this.action = "update";
      return;
    }
    if (!(value in Folders)) {
      throw new Error(`Folder with id ${value} does not exist.`);
    }
    this.#folder = value;
    this.action = "update";
  }

  get name(): string {
    return this.#name;
  }

  set name(value: string) {
    this.#name = value;
    this.action = "update";
  }

  get notes(): string {
    return this.#notes;
  }

  set notes(value: string) {
    this.#notes = value;
    this.action = "update";
  }

  get tags(): TagsRecord[] {
    return [...this.#tags];
  }

  addTag(tag: TagEntry): boolean {
    const tagRecord = getTagRecord(tag);
    if (this.#tags.has(tagRecord)) {
      return false;
    }
    this.#tags.add(tagRecord);
    this.action = "update";
    return true;
  }

  removeTag(tag: TagEntry): boolean {
    const tagRecord = getTagRecord(tag);
    if (!this.#tags.has(tagRecord)) {
      return false;
    }
    this.#tags.delete(tagRecord);
    this.action = "update";
    return true;
  }
}

const Files: Record<FilesRecord["id"], FilesRecord> = {};

type FilesRecordEntry = FilesRecord | number;

function getFilesRecord(entry: FilesRecordEntry): FilesRecord {
  if (entry instanceof FilesRecord) {
    return entry;
  }
  const fileRecord = Files[entry];
  if (!fileRecord) {
    throw new Error(`File with id ${entry} does not exist.`);
  }
  return fileRecord;
}

export { FilesRecord, Files, type FilesRecordEntry, getFilesRecord };
