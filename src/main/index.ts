import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { type Config, initializeConfig } from './config.defs';
import { rawConfig } from './config';
import { DbLinks } from '../DbLinks';
import { registerApiHandlers } from './api';

let config: Config | null = null;

function createWindow(): void {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        autoHideMenuBar: !(config?.debug),
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false,
        },
    });

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: 'deny' };
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron');

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    // IPC test
    ipcMain.on('ping', () => console.log('pong'));

    // Initialize config and data links
    try {
        config = await initializeConfig(rawConfig);
        if (config.debug) {
            console.debug('Processed config', config);
        }
        if (config.db) {
            const dataLink = new DbLinks(config.db);
            dataLink.fetchAll().then(() => {
                if (config!.debug) {
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
            });
            registerApiHandlers({ dataLink });
        } else {
            console.warn('No database connection available');
        }
    } catch (error) {
        console.error('Failed to initialize config', error);
    }

    createWindow();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
