const {app, BrowserWindow, ipcMain, Menu, shell} = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
let destination = path.join(os.homedir(), 'Music');
require('dotenv').config();

const isDev = process.env.NODE_ENV === 'development' ? true : false;

const isMac = process.platform === 'darwin' ? true : false;

function createWindow(){
    const win = new BrowserWindow({
        width: isDev ? 950 : 500,
        resizable: isDev ? true : false,
        height: 300,
        backgroundColor: '#234',
        show: false,
        icon: path.join(__dirname, 'assets', 'icons', 'icon.png'),
        webPreferences: {
            nodeIntegration: false
        }
    })

    win.loadFile('./src/mainWindow/index.html');

    if(isDev){
        win.webContents.openDevTools();
    }

    win.once('ready-to-show', ()=>{
        win.show();

        const menuTemplate = [
            {
                label: app.name,
                submenu: [
                    {label: 'Preferences', click: ()=>{}},
                    {label: 'Open destination folder', click: ()=>{shell.openPath(destination)}}
                ]
            },
            {
                label: 'File',
                submenu: [
                    isMac ? {role: 'close'} : {role: 'quit'}
                ]
            }
        ];

        const menu = Menu.buildFromTemplate(menuTemplate);
        Menu.setApplicationMenu(menu);
    })
}

app.whenReady().then(()=>{
    createWindow();
})

app.on('window-all-closed', ()=>{
    console.log("Todas as janelas fechadas");
    if(!isMac){
        app.quit();
    }
})

app.on('activate', ()=>{
    if(BrowserWindow.getAllWindows().length === 0){
        createWindow();
    }
})

ipcMain.on('save_buffer', (e, buffer)=>{
    const filePath = path.join(destination, `${Date.now()}`);
    fs.writeFileSync(`${filePath}.webm`, buffer);
})