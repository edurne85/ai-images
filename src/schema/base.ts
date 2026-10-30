type RecordPendingAction = 'wait' | 'none' | 'delete' | 'insert' | 'update' | 'invalid';

abstract class RecordBase {
    #action: RecordPendingAction;

    protected constructor(action: RecordPendingAction) {
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
}

function clearRecords<T extends string | number | symbol, R>(records: Record<T, R>): void {
    for (const key in records) {
        if (Object.prototype.hasOwnProperty.call(records, key)) {
            delete records[key];
        }
    }
}

export { type RecordPendingAction, RecordBase, clearRecords };
