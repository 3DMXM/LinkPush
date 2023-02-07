import { app, BrowserWindow, shell, ipcMain, Menu } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import https from 'node:https'

import { GetConfig, SetConfig } from '../model/config'
import { PubsToBaidu, PubsToBing } from '../model/pubs'

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? join(process.env.DIST_ELECTRON, '../public')
    : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {

    let width = 900
    let height = 600

    // 判断环境是否是开发环境
    if (process.env.NODE_ENV === 'development') {
        width += 550
    }

    Menu.setApplicationMenu(null)
    win = new BrowserWindow({
        title: '搜索引擎提交工具',
        icon: join(process.env.PUBLIC, 'favicon.ico'),
        webPreferences: {
            preload,
            // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
            // Consider using contextBridge.exposeInMainWorld
            // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
            nodeIntegration: true,
            contextIsolation: false,
        },
        minWidth: width,
        minHeight: height,
        frame: false,
    })

    if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
        win.loadURL(url)
        // Open devTool if the app is not packaged
        win.webContents.openDevTools()
    } else {
        win.loadFile(indexHtml)
    }

    // Test actively push message to the Electron-Renderer
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', new Date().toLocaleString())
    })

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return { action: 'deny' }
    })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        childWindow.loadURL(`${url}#${arg}`)
    } else {
        childWindow.loadFile(indexHtml, { hash: arg })
    }
})

// 窗口最小化
ipcMain.on('window-min', function () {
    if (win) {
        win.minimize();
    }
})
//窗口最大化
ipcMain.on('window-max', function () {
    if (win) {
        if (win.isMaximized()) {
            win.restore();
        } else {
            win.maximize();
        }
    }
})
//关闭窗口
ipcMain.on('window-close', function () {
    if (win) {
        win.close();
    }
})

ipcMain.on('get-sitemap-links', (event, sitemap) => {
    // 拆分 sitemap 链接
    let host = sitemap.split('/')[2];
    let path = sitemap.split(host)[1];
    let options: https.RequestOptions = {
        host: host,
        path: path,
        method: 'GET',
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
    }
    https.get(options, function (res) {
        // 接收返回值
        let data = '';
        let links = [];
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            // 正则匹配 url
            let reg = /<loc>(.*?)<\/loc>/g;
            let arr = data.match(reg);
            if (arr) {
                arr.forEach((item) => {
                    links.push(item.replace('<loc>', '').replace('</loc>', ''));
                });
            }
            // console.log(links);
            event.reply('get-sitemap-links-reply', links);
        });
    });
})

ipcMain.handle('get-config', (event, arg) => {
    let data = GetConfig()
    return data
})

ipcMain.handle('set-config', (event, arg) => {
    SetConfig(arg)
})

ipcMain.on('pubs-baidu', (event, arg) => {
    // links: string[], site: string, token: string, daily: boolean
    PubsToBaidu(arg.links, arg.site, arg.token, arg.daily, function (err, data) {
        event.reply('pubs-reply', data)
    })
})

ipcMain.on('pubs-bing', (event, arg) => {
    // urlList: string[], siteUrl: string, token: string
    PubsToBing(arg.links, arg.site, arg.token, function (err, data) {
        event.reply('pubs-reply', data)
    })
})