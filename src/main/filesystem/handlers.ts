import { ipcMain, type IpcMainInvokeEvent } from 'electron';
import { type DffEntry, runDffParsed, deleteDuplicates } from './dff';
import { type Config } from '../config.defs';
import { getAllSources, getSourcesInGroup } from './FolderInfo';

let parsedDffEntries: DffEntry[] = [];

function registerFileSystemApiHandlers(config: Config): void {
    ipcMain.on('fs:get:dffEntries', async (): Promise<DffEntry[]> => {
        parsedDffEntries = runDffParsed(config);
        return parsedDffEntries;
    });

    ipcMain.on('fs:delete:dffDuplicates', async (): Promise<number> =>
        deleteDuplicates(config, ...parsedDffEntries)
    );

    ipcMain.on(
        'fs:get:sourcesInGroup',
        async (_: IpcMainInvokeEvent, group: string): Promise<string[]> =>
            getSourcesInGroup(config, group)
    );

    ipcMain.on('fs:get:allSources', async (): Promise<Record<string, string[]>> =>
        getAllSources(config)
    );
}

export { registerFileSystemApiHandlers };
