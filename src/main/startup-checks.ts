import { DbLinks } from '../DbLinks';
import { type FoldersRecord } from '../schema';
import { type Config, type ConfigWithDb } from './config.defs';
import { getAllSources, getSourcesInGroup } from './filesystem';
import { deleteAllDuplicates } from './filesystem/dff/deleteDuplicates';

async function startDbLinks(config: Config): Promise<DbLinks | null> {
    if (config.db) {
        const dataLink = new DbLinks(config.db);
        await dataLink.fetchAll();
        if (config.debug) {
            console.debug(
                'Fetched data:\n',
                `\t${dataLink.foldersCount} folders,\n`,
                `\t${dataLink.tagsCount} tags,\n`,
                `\t${dataLink.appsCount} apps,\n`,
                `\t${dataLink.filesCount} files,\n`,
                `\t${dataLink.swapsCount} swaps,\n`,
                `\t${dataLink.fileTagsCount} file tags entries`
            );
        }
        return dataLink;
    } else {
        console.warn('No database connection available');
        return null;
    }
}

async function matchFilesInFolder(config: ConfigWithDb, dbLinks: DbLinks, folder: FoldersRecord): Promise<void> {
    const dbFiles = dbLinks.files.data;
    const filesInFs = new Set<string>(getSourcesInGroup(config, folder.name));
    const deleteQuery = `DELETE FROM SourceFiles WHERE id = ?`;
    for (const filesKey of Object.keys(dbFiles)) {
        const filesRecord = dbFiles[filesKey];
        if (filesRecord.folder.name !== folder.name) {
            continue;
        }
        if (filesInFs.has(filesRecord.name)) {
            filesInFs.delete(filesRecord.name);
        } else if (config.autoDeleteSources) {
            try {
                await config.db.run(deleteQuery, filesKey);
                if (config.debug) {
                    console.debug(`File ${filesRecord.name} deleted from DB.`);
                }
            } catch (err) {
                console.error(`SQL error: ${err}`);
            }
        } else {
            console.warn(`File ${filesRecord.name} not found in FS!`);
        }
    }
    if (config.autoInsertSources) {
        const insertQuery = `INSERT INTO SourceFiles (Folder, File) VALUES (?, ?)`;
        for (const file of filesInFs) {
            try {
                await config.db.run(insertQuery, folder.id, file);
                if (config.debug) {
                    console.debug(`File ${folder.name}/${file} inserted into DB.`);
                }
            } catch (err) {
                console.error(`SQL error: ${err}`);
            }
        }
    }
    await dbLinks.files.dbFetchAll();
}

async function matchFolders(config: ConfigWithDb, dbLinks: DbLinks): Promise<void> {
    const dbFolders = dbLinks.folders.data;
    const allSourcesInFs = getAllSources(config);
    const foldersInFs = new Set<string>(Object.keys(allSourcesInFs));
    for (const folderKey of Object.keys(dbFolders)) {
        const folderId = parseInt(folderKey);
        const folderName = dbFolders[folderId].name;
        if (foldersInFs.has(folderName)) {
            foldersInFs.delete(folderName);
        } else {
            console.warn(`Folder ${dbFolders[folderKey].name} not found in FS!`);
        }
    }
    if (config.autoInsertFolders && foldersInFs.size > 0) {
        const query = `INSERT INTO SourceFolders (Source) VALUES (?)`;
        for (const folder of foldersInFs) {
            try {
                await config.db.run(query, folder);
                if (!config.silent) {
                    console.info(`Folder ${folder} inserted into DB.`);
                }
            } catch (err) {
                console.error(`SQL error: ${err}`);
            }
        }
        dbLinks.folders.dbFetchAll();
    }
    const updatedDbFolders = dbLinks.folders.data;
    for (const folderKey of Object.keys(updatedDbFolders)) {
        await matchFilesInFolder(config, dbLinks, updatedDbFolders[folderKey]);
    }
}

function autoDeleteDuplicates(config: Config): void {
    if (config.autoDeleteDuplicates) {
        const deleted = deleteAllDuplicates(config);
        if (!config.silent && deleted > 0) {
            console.info(`Deleted ${deleted} duplicates`);
        }
    }
}

export { startDbLinks, matchFolders, autoDeleteDuplicates };
