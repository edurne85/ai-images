import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { type Api } from './index.d';
import * as $schema from '../schema';

// Custom APIs for renderer
const api: Api = {
    db: {
        getApps(): $schema.AppsRawBuilder[] {
            const raw = ipcRenderer.sendSync('db:get:apps');
            return Object.values(raw);
        },
        updateApps(value: $schema.AppsData): void {
            // TODO: rebuild to take $schema.AppsRawBuilder[]
            ipcRenderer.sendSync('db:update:apps', value);
        },

        getFolders(): $schema.FoldersRawBuilder[] {
            const raw = ipcRenderer.sendSync('db:get:folders');
            return Object.values(raw);
        },
        updateFolders(value: $schema.FoldersData): void {
            // TODO: Rebuild to take $schema.FoldersRawBuilder[]
            ipcRenderer.sendSync('db:update:folders', value);
        },

        getFiles(): $schema.FilesRawBuilder[] {
            const raw = ipcRenderer.sendSync('db:get:files');
            return Object.values(raw);
        },
        updateFiles(value: $schema.FilesData): void {
            // TODO: Rebuild to take $schema.FilesRawBuilder[]
            ipcRenderer.sendSync('db:update:files', value);
        },

        getSwaps(): $schema.SwapsRawBuilder[] {
            const raw = ipcRenderer.sendSync('db:get:swaps');
            return Object.values(raw);
        },
        updateSwaps(value: $schema.SwapsData): void {
            // TODO: Rebuild to take $schema.SwapsRawBuilder[]
            ipcRenderer.sendSync('db:update:swaps', value);
        },

        getTags(): $schema.TagsRawBuilder[] {
            const raw = ipcRenderer.sendSync('db:get:tags');
            return Object.values(raw);
        },
        updateTags(value: $schema.TagsData): void {
            // TODO: Rebuild to take $schema.TagsRawBuilder[]
            ipcRenderer.sendSync('db:update:tags', value);
        },
    },
    fs: {
        // getDffEntries(): DffEntry (type not exposed to renderer!)
        deleteDuplicates(): number {
            return ipcRenderer.sendSync('fs:delete:dffDuplicates');
        },

        getSourcesInGroup(group: string): string[] {
            return ipcRenderer.sendSync('fs:get:sourcesInGroup', group);
        },

        getAllSources(): Record<string, string[]> {
            return ipcRenderer.sendSync('fs:get:sources');
        },
    },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI);
        contextBridge.exposeInMainWorld('api', api);
    } catch (error) {
        console.error(error);
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI;
    // @ts-ignore (define in dts)
    window.api = api;
}
