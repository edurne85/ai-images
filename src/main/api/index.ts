import { DbLinks } from '../../DbLinks';
import { registerDbApiHandlers } from './db';
import { registerFileSystemApiHandlers } from '../filesystem';
import { Config } from '../config.defs';

type ApiHandlersArgs = {
    config: Config;
};

function registerApiHandlers({ config }: ApiHandlersArgs): void {
    if (config.db) {
        registerDbApiHandlers(new DbLinks(config.db));
    }
    registerFileSystemApiHandlers(config);
}

export { registerApiHandlers };
