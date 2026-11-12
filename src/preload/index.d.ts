import { ElectronAPI } from '@electron-toolkit/preload';
import { TagsData } from '@schema/Tags';

declare global {
    interface Window {
        electron: ElectronAPI;
        api: {
            db: {
                getApps(): AppsData;
                updateApps(value: AppsData);
                getFolders(): FoldersData;
                updateFolders(value: FoldersData);
                getFiles(): FilesData;
                updateFiles(value: FilesData);
                getSwaps(): SwapsData;
                updateSwaps(value: SwapsData);
                getTags(): TagsData;
                updateTags(value: TagsData);
            };
            fs: {
                deleteDuplicates(): number;
                getSourcesInGroup(group: string): string[];
                getAllSources(): Record<string, string[]>;
            };
        };
    }
}
