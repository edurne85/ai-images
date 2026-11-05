import { DbLinks } from '../../DbLinks';
import { registerDbApiHandlers } from './db';

type ApiHandlersArgs = {
    dataLink: DbLinks;
};

function registerApiHandlers({ dataLink }: ApiHandlersArgs): void {
    registerDbApiHandlers(dataLink);
}

export { registerApiHandlers };
