import {
    AppsTableEntries,
    FilesTableEntries,
    FoldersTableEntries,
    SwapsTableEntries,
    TagsTableEntries,
} from './helpers';

import { createContext } from 'react';

class DbProvider {
    #apps: AppsTableEntries = new AppsTableEntries();
    #files: FilesTableEntries = new FilesTableEntries();
    #folders: FoldersTableEntries = new FoldersTableEntries();
    #swaps: SwapsTableEntries = new SwapsTableEntries();
    #tags: TagsTableEntries = new TagsTableEntries();

    get apps(): AppsTableEntries {
        this.#folders.parse();
        this.#apps.parse();
        return this.#apps;
    }

    get files(): FilesTableEntries {
        this.#folders.parse();
        this.#tags.parse();
        this.#files.parse();
        return this.#files;
    }

    get folders(): FoldersTableEntries {
        this.#folders.parse();
        return this.#folders;
    }

    get swaps(): SwapsTableEntries {
        this.#files.parse();
        this.#swaps.parse();
        return this.#swaps;
    }

    get tags(): TagsTableEntries {
        this.#tags.parse();
        return this.#tags;
    }
}

const DbContext = createContext<DbProvider>(new DbProvider());

export { DbContext, DbProvider };
