export { type DbLink, DbTableLinkBase } from './base';
export { type AppsRow, AppsLink } from './Apps.db';
export { type FilesRow, FilesLink } from './Files.db';
export { type FoldersRow, FoldersLink } from './Folders.db';
export { type SwapsRow, SwapsLink } from './Swaps.db';
export { type TagsRow, TagsLink } from './Tags.db';
export { type SourceFileTagsRow, SourceFileTagsLink } from './SourceFileTags.db';

import { type DbLink } from './base';
import { AppsLink } from './Apps.db';
import { FoldersLink } from './Folders.db';
import { FilesLink } from './Files.db';
import { SwapsLink } from './Swaps.db';
import { TagsLink } from './Tags.db';
import { SourceFileTagsLink } from './SourceFileTags.db';

class DbLinks {
    #dblink: DbLink;
    #apps: AppsLink;
    #folders: FoldersLink;
    #files: FilesLink;
    #swaps: SwapsLink;
    #tags: TagsLink;
    #sourceFileTags: SourceFileTagsLink;

    constructor(dbLink: DbLink) {
        this.#dblink = dbLink;
        this.#folders = new FoldersLink(dbLink);
        this.#tags = new TagsLink(dbLink);
        this.#apps = new AppsLink(dbLink);
        this.#files = new FilesLink(dbLink);
        this.#swaps = new SwapsLink(dbLink);
        this.#sourceFileTags = new SourceFileTagsLink(dbLink, this.#files, this.#tags);
    }

    async fetchAll(): Promise<void> {
        await this.#folders.dbFetchAll();
        await this.#tags.dbFetchAll();
        await this.#apps.dbFetchAll();
        await this.#files.dbFetchAll();
        await this.#swaps.dbFetchAll();
    }

    get dbLink(): DbLink {
        return this.#dblink;
    }

    get apps(): AppsLink {
        return this.#apps;
    }

    get appsCount(): number {
        return Object.keys(this.#apps.data).length;
    }

    get folders(): FoldersLink {
        return this.#folders;
    }

    get foldersCount(): number {
        return Object.keys(this.#folders.data).length;
    }

    get files(): FilesLink {
        return this.#files;
    }

    get filesCount(): number {
        return Object.keys(this.#files.data).length;
    }

    get swaps(): SwapsLink {
        return this.#swaps;
    }

    get swapsCount(): number {
        return Object.keys(this.#swaps.data).length;
    }

    get tags(): TagsLink {
        return this.#tags;
    }

    get tagsCount(): number {
        return Object.keys(this.#tags.data).length;
    }

    get fileTags(): SourceFileTagsLink {
        return this.#sourceFileTags;
    }

    get fileTagsCount(): number {
        return this.#sourceFileTags.count;
    }
}

export { DbLinks };
