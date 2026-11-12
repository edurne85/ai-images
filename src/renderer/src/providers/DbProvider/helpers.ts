import * as $schema from '../../../../schema';
import { type Replacer, DbTableEntries, objectReplacer } from './base';
class AppsTableEntries extends DbTableEntries<$schema.AppsRawBuilder, $schema.AppsRecord> {
    #cacheReplacer: Replacer<$schema.AppsRecord> = objectReplacer<$schema.AppsRecord, number>(
        $schema.Apps
    );
    get cacheReplacer(): Replacer<$schema.AppsRecord> {
        return this.#cacheReplacer;
    }

    dbFetch(): $schema.AppsRawBuilder[] {
        return window.api.db.getApps();
    }
    getKey(raw: $schema.AppsRawBuilder): number {
        return raw.id;
    }
    build(raw: $schema.AppsRawBuilder): $schema.AppsRecord {
        return new $schema.AppsRecord(raw);
    }
}

class FilesTableEntries extends DbTableEntries<$schema.FilesRawBuilder, $schema.FilesRecord> {
    #cacheReplacer: Replacer<$schema.FilesRecord> = objectReplacer<$schema.FilesRecord, number>(
        $schema.Files
    );
    get cacheReplacer(): Replacer<$schema.FilesRecord> {
        return this.#cacheReplacer;
    }
    dbFetch(): $schema.FilesRawBuilder[] {
        return window.api.db.getFiles();
    }
    getKey(raw: $schema.FilesRawBuilder): number {
        return raw.id;
    }
    build(raw: $schema.FilesRawBuilder): $schema.FilesRecord {
        return new $schema.FilesRecord(raw);
    }
}

class FoldersTableEntries extends DbTableEntries<$schema.FoldersRawBuilder, $schema.FoldersRecord> {
    #cacheReplacer: Replacer<$schema.FoldersRecord> = objectReplacer<$schema.FoldersRecord, number>(
        $schema.Folders
    );
    get cacheReplacer(): Replacer<$schema.FoldersRecord> {
        return this.#cacheReplacer;
    }
    dbFetch(): $schema.FoldersRawBuilder[] {
        return window.api.db.getFolders();
    }
    getKey(raw: $schema.FoldersRawBuilder): number {
        return raw.id;
    }
    build(raw: $schema.FoldersRawBuilder): $schema.FoldersRecord {
        return new $schema.FoldersRecord(raw);
    }
}

class SwapsTableEntries extends DbTableEntries<$schema.SwapsRawBuilder, $schema.SwapsRecord> {
    #cacheReplacer: Replacer<$schema.SwapsRecord> = objectReplacer<$schema.SwapsRecord, number>(
        $schema.Swaps
    );
    get cacheReplacer(): Replacer<$schema.SwapsRecord> {
        return this.#cacheReplacer;
    }
    dbFetch(): $schema.SwapsRawBuilder[] {
        return window.api.db.getSwaps();
    }
    getKey(raw: $schema.SwapsRawBuilder): number {
        return raw.id;
    }
    build(raw: $schema.SwapsRawBuilder): $schema.SwapsRecord {
        return new $schema.SwapsRecord(raw);
    }
}

class TagsTableEntries extends DbTableEntries<$schema.TagsRawBuilder, $schema.TagsRecord> {
    #cacheReplacer: Replacer<$schema.TagsRecord> = objectReplacer<$schema.TagsRecord, number>(
        $schema.Tags
    );
    get cacheReplacer(): Replacer<$schema.TagsRecord> {
        return this.#cacheReplacer;
    }
    dbFetch(): $schema.TagsRawBuilder[] {
        return window.api.db.getTags();
    }
    getKey(raw: $schema.TagsRawBuilder): number {
        return raw.id;
    }
    build(raw: $schema.TagsRawBuilder): $schema.TagsRecord {
        return new $schema.TagsRecord(raw);
    }
}

export {
    AppsTableEntries,
    FilesTableEntries,
    FoldersTableEntries,
    SwapsTableEntries,
    TagsTableEntries,
};
