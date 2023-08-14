import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path from 'node:path'
import { release } from 'node:os'
import https from 'node:https'
import { Push } from './Push'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}
let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
    let width = 1280
    let height = 720

    // 判断环境是否是开发环境
    if (process.env.NODE_ENV === 'development') {
        width += 550
    }

    win = new BrowserWindow({
        icon: path.join(process.env.PUBLIC, 'electron-vite.svg'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
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

    // Test active push message to Renderer-process.
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL)
        // Open devTool if the app is not packaged
        win.webContents.openDevTools()
    } else {
        // win.loadFile('dist/index.html')
        win.loadFile(path.join(process.env.DIST, 'index.html'))
    }

    // 新窗口打开链接
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return { action: 'deny' }
    })
}

app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(createWindow)


app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})


// New window example arg: new windows url
ipcMain.handle('open-win', (_) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    if (VITE_DEV_SERVER_URL) {
        childWindow.loadURL(VITE_DEV_SERVER_URL)
        // Open devTool if the app is not packaged
        childWindow.webContents.openDevTools()
    } else {
        // win.loadFile('dist/index.html')
        childWindow.loadFile(path.join(process.env.DIST, 'index.html'))
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

// 从sitemap 获取链接

ipcMain.handle('get-sitemap', (_, sitemap) => {
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

    return new Promise((resolve, reject) => {
        https.get(options, function (res) {
            // 接收返回值
            let data = '';
            let links: string[] = [];
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
                resolve(links);
            });
            res.on('error', function (err) {
                reject(err);
            })
        });
    })
})

ipcMain.handle('pubs-baidu', async (_, arg) => {
    // links: string[], site: string, token: string, daily: boolean
    let data = await Push.PubsToBaidu(arg.links, arg.site, arg.token, arg.daily)
    return await data.text()

})

ipcMain.handle('pubs-bing', async (_, arg) => {
    // urlList: string[], siteUrl: string, token: string
    let data = await Push.PubsToBing(arg.links, arg.site, arg.token)
    return data
})