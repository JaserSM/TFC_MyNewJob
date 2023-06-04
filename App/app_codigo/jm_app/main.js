
const { app, BrowserWindow } = require('electron')
const remoteMain = require('@electron/remote/main')
const path = require('path')
const { ipcMain } = require('electron')
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
const { shell } = require('electron')

const { promisify } = require('util')
const exec = promisify(require('child_process').exec)

remoteMain.initialize()

async function sh(cmd) {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err)
      } else {
        resolve({ stdout, stderr });
      }
    })
  })
}
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
function executeShell() {
  shell.openExternal('file://C:/Users/jomas/Documents/2_DAM/TFC/Scraping/app/scraping/scraping_1.py')
  //shell.openItem('c:/Users/jomas/Documents/2_DAM/TFC/Scraping/app/scraping/preuba.txt')
}
function exeShell () {
  //const done = this.async()
  exec('C:/Users/jomas/Documents/2_DAM/TFC/Scraping/output/scraping_1.exe', function (error, stdout, stderr) {
    console.log(error)
    console.log(stdout)
    console.log(stderr)
    //done()
  })
}

function createWindow () {
  let win = new BrowserWindow({
    show: false,
    icon: path.join(__dirname, 'ICONO_App_reducido.png'),
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadFile('index.html')

  /// CLOSE APP
  ipcMain.on('closeApp', () => {
    // console.log('Clicked on Close Btn')
    win.close()
  })
  /// FullSCREEN APP
  ipcMain.on('maximizeApp', () => {
    // console.log('Clicked on Close Btn')
    if (win.isMaximized()) {
      win.restore()
    } else {
      win.maximize()
    }
  })
  /// MINIMIZE APP
  ipcMain.on('minimizeBtn', () => {
    // console.log('Clicked on Close Btn')
    win.minimize()
  })


  ipcMain.on('loadConfig', () => {
    let winnew = new BrowserWindow({
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      }
    })
    winnew.loadFile('configuration.html')
    winnew.setMenu(null)
    //winnew.webContents.openDevTools()

    winnew.on('closed', () => {
      winnew=null
    })
  })

  ipcMain.on('loadExplorer', () => {
    shell.openExternal('file://c:/windows/explorer.exe')
  })

  ipcMain.on('loadDoc', () => {
    //console.log(app.getAppPath())
    shell.openPath('userManual.pdf')
  })

  ipcMain.on('runScraping', () => {
    shell.openPath(path.join(app.getAppPath(),'scraping_1','scraping_1.exe'))
  })

  ipcMain.on('loadShell', () => {
    exeShell()
    //var child = spawn('cmd')
    //child.on()
  })

  remoteMain.enable(win.webContents)
  //win.webContents.openDevTools()
  win.on('closed', () => {
    win = null
  })

  let splash = new BrowserWindow({
    width: 750,
    height: 450,
    resizable: false,
    transparent: false,
    frame: false,
    alwaysOnTop: true
  })
  splash.loadFile('splash.html')
  splash.center()

  setTimeout(function () {
    splash.close()
    win.maximize()
    win.show()
  }, 6000)
}

app.on('ready', createWindow)
