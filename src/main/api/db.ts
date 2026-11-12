import { ipcMain, type IpcMainEvent } from 'electron';
import { DbLinks } from '../../DbLinks';
import {
    serializeObjects,
    type AppsData,
    type FilesData,
    type FoldersData,
    type SwapsData,
    type TagsData,
} from '../../schema';

function registerDbApiHandlers(dataLink: DbLinks): void {
    ipcMain.on('db:get:apps', async (event: IpcMainEvent): Promise<void> => {
        event.returnValue = serializeObjects(dataLink.apps.data);
    });
    ipcMain.on('db:update:apps', async (event: IpcMainEvent, apps: AppsData): Promise<void> => {
        // TODO: Refactor to take AppsRawBuilder[] param
        await dataLink.apps.refreshData(apps, dataLink.folders.data);
        event.returnValue = { ...dataLink.apps.data };
    });
    ipcMain.on('db:get:files', async (event: IpcMainEvent): Promise<void> => {
        event.returnValue = serializeObjects(dataLink.files.data);
    });
    ipcMain.on('db:update:files', async (event: IpcMainEvent, files: FilesData): Promise<void> => {
        // TODO: Refactor to take FilesRawBuilder[] param
        await dataLink.files.refreshData(files, dataLink.folders.data);
        event.returnValue = { ...dataLink.files.data };
    });
    ipcMain.on('db:get:folders', async (event: IpcMainEvent): Promise<void> => {
        event.returnValue = serializeObjects(dataLink.folders.data);
    });
    ipcMain.on(
        'db:update:folders',
        async (event: IpcMainEvent, folders: FoldersData): Promise<void> => {
            // TODO: Refactor to take FoldersRawBuilder[] param
            await dataLink.folders.refreshData(folders);
            event.returnValue = { ...dataLink.folders.data };
        }
    );
    ipcMain.on('db:get:swaps', async (event: IpcMainEvent): Promise<void> => {
        event.returnValue = serializeObjects(dataLink.swaps.data);
    });
    ipcMain.on('db:update:swaps', async (event: IpcMainEvent, swaps: SwapsData): Promise<void> => {
        // TODO: Refactor to take SwapsRawBuilder[] param
        await dataLink.swaps.refreshData(swaps, dataLink.files.data);
        event.returnValue = { ...dataLink.swaps.data };
    });
    ipcMain.on('db:get:tags', async (event: IpcMainEvent): Promise<void> => {
        event.returnValue = serializeObjects(dataLink.tags.data);
    });
    ipcMain.on('db:update:tags', async (event: IpcMainEvent, tags: TagsData): Promise<void> => {
        // TODO: Refactor to take TagsRawBuilder[] param
        await dataLink.tags.refreshData(tags);
        event.returnValue = { ...dataLink.tags.data };
    });
}

export { registerDbApiHandlers };
