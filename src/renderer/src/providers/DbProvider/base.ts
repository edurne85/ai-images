import { type RecordBase, type RecordBaseBuilder, clearRecords } from "../../../../schema";

type Replacer<Class extends RecordBase, Key extends number | string | symbol = number> = (
    newCache: Record<Key, Class>
) => void;

abstract class DbTableEntries<
    Raw extends RecordBaseBuilder,
    Class extends RecordBase,
    Key extends number | string | symbol = number,
> {
    #rawCached: Record<Key, Raw> | null = null;
    #parsedCached: Record<Key, Class> | null = null;

    abstract dbFetch(): Raw[];
    abstract getKey(raw: Raw): Key;
    abstract build(raw: Raw): Class;
    abstract get cacheReplacer(): Replacer<Class, Key>;

    get raw(): Record<Key, Raw> {
        if (this.#rawCached === null) {
            const rawArray = this.dbFetch();
            const obj = {} as Record<Key, Raw>;
            for (const entry of rawArray) {
                obj[this.getKey(entry)] = entry;
            }
            this.#rawCached = obj;
        }
        return this.#rawCached;
    }

    parse(): Record<Key, Class> {
        if (this.#parsedCached === null) {
            const raw = this.raw;
            const obj = {} as Record<Key, Class>;
            for (const key of Object.keys(raw).filter((k) => !!raw[k])) {
                obj[key] = this.build(raw[key]);
            }
            this.#parsedCached = obj;
            this.cacheReplacer(obj);
        }
        return this.#parsedCached;
    }

    get parsed(): Record<Key, Class> {
        return this.parse();
    }
}

function objectReplacer<
    Class extends RecordBase,
    Key extends number | string | symbol = number,
>(target: Record<Key, Class>): Replacer<Class, Key> {
    return function (newCache: Record<Key, Class>): void {
        clearRecords(target);
        for (const key of Object.keys(newCache)) {
            target[key] = newCache[key];
        }
    };
}

export { type Replacer, DbTableEntries, objectReplacer };
