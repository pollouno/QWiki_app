const { app, BrowserWindow, ipcMain } = require('electron')

const initSqlJs = require('sql.js');
const path = require("path");
const { storage } = require('./js/storage');
let db = null;
let win;

initSqlJs().then(function (SQL) {
	db = storage.loadDB(SQL, './res/db.sqlite');
});

const createWindow = () => {
	win = new BrowserWindow({
		webPreferences: {
			enableRemoteModule: false, // turn off remote
			preload: path.join(__dirname, "/js/preload.js") // use a preload script
		},
		width: 800,
		height: 600,
	})
	win.loadFile('index.html')
}

app.on('ready', () => {
	ipcMain.on('storage:exportToJSON', (event) => {
		storage.exportToJSON();
	});
	ipcMain.on('storage:categoryCreate', (event, id, name, parentId) => {
		storage.categoryCreate(db, id, name, parentId);
	});
	ipcMain.on('storage:categoryUpdate', (event, id, name, parentId) => {
		storage.categoryUpdate(db, id, name, parentId);
	});
	ipcMain.on('storage:categoryRemove', (event, id) => {
		storage.categoryRemove(db, id);
	});
	ipcMain.on('storage:articleCreate', (event, id, name, tags, categoryId) => {
		storage.articleCreate(db, id, name, tags, categoryId);
	});
	ipcMain.on('storage:articleUpdate', (event, id, name, tags, categoryId) => {
		storage.articleUpdate(db, id, name, tags, categoryId);
	});
	ipcMain.on('storage:articleRemove', (event, id) => {
		storage.articleRemove(db, id);
	});
	ipcMain.on('storage:articleGetContent', (event, id) => {
		storage.articleGetContent(db, id);
	});
	ipcMain.on('storage:articleSetContent', (event, id, content) => {
		storage.articleSetContent(db, id, content);
	});
	ipcMain.on('storage:articleApplyDelta', (event, id, delta) => {
		storage.articleApplyDelta(db, id, delta);
	});

	createWindow();
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	});
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})