import { type DbLink } from './base';
import { FilesLink } from './Files.db';
import { TagsLink } from './Tags.db';

type SourceFileTagsRow = {
    FileID: number;
    TagID: number;
};

class SourceFileTagsLink {
    #dblink: DbLink;
    #filesLink: FilesLink;
    #tagsLink: TagsLink;
    #rawData: SourceFileTagsRow[];

    constructor(dbLink: DbLink, filesLink: FilesLink, tagsLink: TagsLink) {
        this.#dblink = dbLink;
        this.#filesLink = filesLink;
        this.#tagsLink = tagsLink;
        this.#rawData = [];
    }

    async fetchAll(): Promise<void> {
        const query = `SELECT FileID, TagID FROM SourceFileTags`;
        this.#rawData = [];

        await this.#dblink.each<SourceFileTagsRow>(query, (err, row) => {
            if (err) {
                throw err;
            }
            this.#rawData.push(row);
        });
    }

    async addTag(fileId: number, tagId: number): Promise<void> {
        const query = `INSERT INTO SourceFileTags (FileID, TagID) VALUES (?, ?)`;
        if (!this.#filesLink.checkKeyExists(fileId)) {
            throw new Error(`File with id ${fileId} does not exist.`);
        }
        if (!this.#tagsLink.checkKeyExists(tagId)) {
            throw new Error(`Tag with id ${tagId} does not exist.`);
        }
        await this.#dblink.run(query, [fileId, tagId]);
        this.#rawData.push({ FileID: fileId, TagID: tagId });
    }

    async removeTag(fileId: number, tagId: number): Promise<void> {
        const query = `DELETE FROM SourceFileTags WHERE FileID = ? AND TagID = ?`;
        await this.#dblink.run(query, [fileId, tagId]);
    }

    get count(): number {
        return this.#rawData.length;
    }

    get data(): SourceFileTagsRow[] {
        return [...this.#rawData];
    }
}

export { type SourceFileTagsRow, SourceFileTagsLink };
