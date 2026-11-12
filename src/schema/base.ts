type RecordPendingAction = 'wait' | 'none' | 'delete' | 'insert' | 'update' | 'invalid';

interface Serializable<T> {
    get $serialized(): T;
}

type RecordBaseBuilder = {
    action: RecordPendingAction;
};

function serializeObjects<K extends string | number | symbol, Raw>(
    source: Record<K, Serializable<Raw>>
): Record<K, Raw> {
    return Object.keys(source).reduce(
        (acc, key) => {
            acc[key] = source[key].$serialized;
            return acc;
        },
        {} as Record<K, Raw>
    );
}

function rebuildObjects<K extends string | number | symbol, Builder, Class>(
    raw: Record<K, Builder>,
    ctor: new (props: Builder) => Class
): Record<K, Class> {
    return Object.keys(raw).reduce(
        (acc, key) => {
            acc[key] = new ctor(raw[key]);
            return acc;
        },
        {} as Record<K, Class>
    );
}

abstract class RecordBase<K extends string | number | symbol = number> implements Serializable<RecordBaseBuilder> {
    #action: RecordPendingAction;

    protected constructor({ action = 'none' }: RecordBaseBuilder) {
        this.#action = action;
    }

    get action(): RecordPendingAction {
        return this.#action;
    }

    protected set action(value: RecordPendingAction) {
        this.#action = value;
    }

    delete(): void {
        this.#action = 'delete';
    }

    changed(): void {
        if (this.#action === 'none') {
            this.#action = 'update';
        }
    }

    updated(): void {
        if (this.#action === 'update') {
            this.#action = 'none';
        }
    }

    abstract get $key(): K;

    get $serialized(): RecordBaseBuilder {
        return {
            action: this.#action,
        };
    }
}

function clearRecords<T extends string | number | symbol, R>(records: Record<T, R>): void {
    for (const key in records) {
        if (Object.prototype.hasOwnProperty.call(records, key)) {
            delete records[key];
        }
    }
}

export {
    type RecordPendingAction,
    type Serializable,
    type RecordBaseBuilder,
    serializeObjects,
    rebuildObjects,
    RecordBase,
    clearRecords,
};
