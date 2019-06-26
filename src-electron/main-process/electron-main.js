import { app, BrowserWindow, ipcMain, Menu } from 'electron'
// import ffprobeHandler from './ipc-handlers/ffprobe'

const authService = require('./auth-service-electron')
const { createAuthWindow } = require('./auth-process')

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = require('path').join(__dirname, 'statics').replace(/\\/g, '\\\\')
}

// global.FFMPEG_PATH = require('ffmpeg-static').path.replace('app.asar', 'app.asar.unpacked')
global.FFPROBE_PATH = require('ffprobe-static').path.replace('app.asar', 'app.asar.unpacked')

let mainWindow

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true
    }
  })

  const template = [
    {
      label: 'Application',
      submenu: [
        { label: 'About', selector: 'orderFrontStandardAboutPanel:' },
        {
          label: 'Developer Console',
          accelerator: 'Alt+CmdOrCtrl+I',
          click: () => mainWindow.webContents.openDevTools()
        },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
      ]
    }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  ipcMain.on('logout', () => {
    authService.logout()
    mainWindow.close()
    createAuthWindow()
  })

  // ipcMain.on('ffprobe', ffprobeHandler)
}

async function showWindow () {
  try {
    await authService.refreshTokens()
    return createWindow()
  }
  catch (err) {
    createAuthWindow()
  }
}

app.on('ready', showWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

export default createWindow
