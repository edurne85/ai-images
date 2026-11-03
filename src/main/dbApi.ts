import { ipcMain } from 'electron';
import { DbLinks } from '../DbLinks';
import {
    type FoldersData,
    type TagsData,
    type AppsData,
    type FilesData,
    type SwapsData,
} from '../schema';

function registerDbApiHandlers(dataLink: DbLinks): void {
    ipcMain.handle('db:get:folders', async (): Promise<FoldersData> => dataLink.folders.data);
    ipcMain.handle('db:update:folders', async (_, folders: FoldersData): Promise<FoldersData> => {
        await dataLink.folders.refreshData(folders);
        return dataLink.folders.data;
    });

    ipcMain.handle('db:get:tags', async (): Promise<TagsData> => dataLink.tags.data);
    ipcMain.handle('db:update:tags', async (_, tags: TagsData): Promise<TagsData> => {
        await dataLink.tags.refreshData(tags);
        return dataLink.tags.data;
    });
    ipcMain.handle('db:get:apps', async (): Promise<AppsData> => dataLink.apps.data);
    ipcMain.handle('db:update:apps', async (_, apps: AppsData): Promise<AppsData> => {
        await dataLink.apps.refreshData(apps, dataLink.folders.data);
        return dataLink.apps.data;
    });
    ipcMain.handle('db:get:files', async (): Promise<FilesData> => dataLink.files.data);
    ipcMain.handle('db:update:files', async (_, files: FilesData): Promise<FilesData> => {
        await dataLink.files.refreshData(files, dataLink.folders.data);
        return dataLink.files.data;
    });
    ipcMain.handle('db:get:swaps', async (): Promise<SwapsData> => dataLink.swaps.data);
    ipcMain.handle('db:update:swaps', async (_, swaps: SwapsData): Promise<SwapsData> => {
        await dataLink.swaps.refreshData(swaps, dataLink.files.data);
        return dataLink.swaps.data;
    });
}

export { registerDbApiHandlers };
