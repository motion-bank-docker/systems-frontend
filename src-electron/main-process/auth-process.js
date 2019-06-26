import {BrowserWindow} from 'electron'
import * as authService from './auth-service-electron'
import createWindow from './electron-main'

let win = null

function createAuthWindow () {
  destroyAuthWin()

  // Create the browser window.
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false
    }
  })

  const {session: {webRequest}} = win.webContents

  const filter = {
    urls: [
      `file:///callback*`
    ]
  }

  webRequest.onBeforeRequest(filter, async ({url}) => {
    await authService.loadTokens(url)
    createWindow()
    return destroyAuthWin()
  })

  win.on('authenticated', () => {
    destroyAuthWin()
  })

  win.on('closed', () => {
    win = null
  })

  win.loadURL(authService.getAuthenticationURL())
}

function destroyAuthWin () {
  if (!win) return
  win.close()
  win = null
}

function createLogoutWindow () {
  return new Promise(resolve => {
    const logoutWindow = new BrowserWindow({
      show: false
    })

    logoutWindow.loadURL(authService.getLogOutUrl())

    logoutWindow.on('ready-to-show', async () => {
      logoutWindow.close()
      await authService.logout()
      resolve()
    })
  })
}

export {
  createAuthWindow,
  createLogoutWindow
}
