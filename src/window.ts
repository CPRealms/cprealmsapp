import { BrowserWindow } from 'electron';
import path = require('path');
import { createAdblocker } from './adblocker/adblocker';
import { Store } from "./store";
import { getUrlFromStore } from './urlchanger';

export const toggleFullScreen = (store: Store, mainWindow: BrowserWindow) => {
    const fullScreen = !store.private.get("fullScreen") ?? false;

    store.private.set("fullScreen", fullScreen);

    mainWindow.setFullScreen(fullScreen);
};

interface FavIconByPlatforms {
    [key: string]: () => void;
}

const createWindow = async (store: Store) => {
    const setFaviconByPlatform: FavIconByPlatforms = {
        win32: () => {
            mainWindow.setIcon(path.join(__dirname, "assets/favicon.ico"));
        },
        darwin: () => {
            mainWindow.setIcon(path.join(__dirname, "assets/icon.png"));
        },
        linux: () => {
            mainWindow.setIcon(path.join(__dirname, "assets/icon.png"));
        },
    };

    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        title: store.private.get('localizer').__('STARTING'),
        webPreferences: {
            plugins: true,
        },
    });

    setFaviconByPlatform[process.platform]();

    mainWindow.setMenu(null);
    mainWindow.maximize();

    await createAdblocker(store, mainWindow);

    const url = getUrlFromStore(store);

    mainWindow.loadURL(url);

    return mainWindow;
};

export default createWindow;
