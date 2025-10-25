const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store').default || require('electron-store');

// Initialize persistent storage
const store = new Store({
    defaults: {
        participants: []
    }
});

let mainWindow = null;
let vizWindow = null;

// Migrate from names.txt if store is empty and file exists
function migrateFromNamesFile() {
    const participants = store.get('participants', []);

    if (participants.length === 0) {
        try {
            const namesPath = path.join(__dirname, '../../names.txt');
            if (fs.existsSync(namesPath)) {
                const content = fs.readFileSync(namesPath, 'utf8');
                const names = content
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line);

                const migratedParticipants = names.map(line => ({
                    name: line.startsWith('#') ? line.substring(1).trim() : line,
                    enabled: !line.startsWith('#'),
                    id: Date.now() + Math.random()
                }));

                store.set('participants', migratedParticipants);
                console.log('Migrated names from names.txt to electron-store');
            }
        } catch (error) {
            console.error('Error migrating from names.txt:', error);
        }
    }
}

// Get active (enabled) names
function loadNames() {
    const participants = store.get('participants', []);
    return participants
        .filter(p => p.enabled)
        .map(p => p.name);
}

// Get all participants (for management UI)
function getParticipants() {
    return store.get('participants', []);
}

// Discover visualizations from folder
function discoverVisualizations() {
    try {
        const vizPath = path.join(__dirname, '../../visualizations');

        if (!fs.existsSync(vizPath)) {
            console.log('No visualizations folder found');
            return [];
        }

        const folders = fs.readdirSync(vizPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        const visualizations = [];

        folders.forEach(folder => {
            const indexPath = path.join(vizPath, folder, 'index.html');
            const manifestPath = path.join(vizPath, folder, 'manifest.json');

            if (fs.existsSync(indexPath)) {
                let metadata = {
                    id: folder,
                    name: folder.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                    description: 'No description available',
                    icon: '🎮'
                };

                // Try to load manifest if it exists
                if (fs.existsSync(manifestPath)) {
                    try {
                        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
                        metadata = { ...metadata, ...manifest };
                    } catch (e) {
                        console.error(`Error reading manifest for ${folder}:`, e);
                    }
                }

                visualizations.push(metadata);
            }
        });

        return visualizations;
    } catch (error) {
        console.error('Error discovering visualizations:', error);
        return [];
    }
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        title: 'Julekalender',
        backgroundColor: '#faf9f5'
    });

    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

    // Open DevTools in development
    if (process.argv.includes('--dev')) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createVizWindow(vizId) {
    // Close existing viz window if open
    if (vizWindow) {
        vizWindow.close();
    }

    vizWindow = new BrowserWindow({
        fullscreen: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        title: 'Julekalender - Visualization',
        backgroundColor: '#000000'
    });

    const vizPath = path.join(__dirname, '../../visualizations', vizId, 'index.html');
    vizWindow.loadFile(vizPath);

    // Inject names after page loads
    vizWindow.webContents.on('did-finish-load', () => {
        const names = loadNames();

        vizWindow.webContents.executeJavaScript(`
            window.JULEKALENDER_NAMES = ${JSON.stringify(names)};

            // Trigger a custom event so the viz knows names are ready
            window.dispatchEvent(new CustomEvent('julekalender-names-loaded', {
                detail: { names: window.JULEKALENDER_NAMES }
            }));
        `);
    });

    // ESC to close
    vizWindow.webContents.on('before-input-event', (event, input) => {
        if (input.key === 'Escape') {
            vizWindow.close();
        }
    });

    vizWindow.on('closed', () => {
        vizWindow = null;
    });
}

// IPC Handlers
ipcMain.handle('get-names', () => {
    return loadNames();
});

ipcMain.handle('get-participants', () => {
    return getParticipants();
});

ipcMain.handle('add-participant', (event, name) => {
    const participants = store.get('participants', []);
    const newParticipant = {
        id: Date.now() + Math.random(),
        name: name.trim(),
        enabled: true
    };
    participants.push(newParticipant);
    store.set('participants', participants);
    return newParticipant;
});

ipcMain.handle('update-participant', (event, id, updates) => {
    const participants = store.get('participants', []);
    const index = participants.findIndex(p => p.id === id);
    if (index !== -1) {
        participants[index] = { ...participants[index], ...updates };
        store.set('participants', participants);
        return participants[index];
    }
    return null;
});

ipcMain.handle('delete-participant', (event, id) => {
    const participants = store.get('participants', []);
    const filtered = participants.filter(p => p.id !== id);
    store.set('participants', filtered);
    return true;
});

ipcMain.handle('toggle-participant', (event, id) => {
    const participants = store.get('participants', []);
    const index = participants.findIndex(p => p.id === id);
    if (index !== -1) {
        participants[index].enabled = !participants[index].enabled;
        store.set('participants', participants);
        return participants[index];
    }
    return null;
});

ipcMain.handle('get-visualizations', () => {
    return discoverVisualizations();
});

ipcMain.handle('launch-visualization', (event, vizId) => {
    createVizWindow(vizId);
});

// App lifecycle
app.whenReady().then(() => {
    migrateFromNamesFile();
    createMainWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createMainWindow();
    }
});
