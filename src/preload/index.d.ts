import { ElectronAPI } from '@electron-toolkit/preload';
import * as $schema from '../schema';

type Api = {
    db: {
        getApps(): $schema.AppsRawBuilder[];
        updateApps(value: $schema.AppsData);
        getFolders(): $schema.FoldersRawBuilder[];
        updateFolders(value: $schema.FoldersData);
        getFiles(): $schema.FilesRawBuilder[];
        updateFiles(value: $schema.FilesData);
        getSwaps(): $schema.SwapsRawBuilder[];
        updateSwaps(value: $schema.SwapsData);
        getTags(): $schema.TagsRawBuilder[];
        updateTags(value: $schema.TagsData);
    };
    fs: {
        deleteDuplicates(): number;
        getSourcesInGroup(group: string): string[];
        getAllSources(): Record<string, string[]>;
    };
};

declare global {
    interface Window {
        electron: ElectronAPI;
        api: Api;
    }
}

export { type Api };
