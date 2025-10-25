const { contextBridge, ipcRenderer } = require('electron');

// Expose safe API to renderer process
contextBridge.exposeInMainWorld('julekalenderAPI', {
    // Get list of active participant names (for visualizations)
    getNames: () => ipcRenderer.invoke('get-names'),

    // Get all participants (for management UI)
    getParticipants: () => ipcRenderer.invoke('get-participants'),

    // Add a new participant
    addParticipant: (name) => ipcRenderer.invoke('add-participant', name),

    // Update a participant
    updateParticipant: (id, updates) => ipcRenderer.invoke('update-participant', id, updates),

    // Delete a participant
    deleteParticipant: (id) => ipcRenderer.invoke('delete-participant', id),

    // Toggle participant enabled/disabled
    toggleParticipant: (id) => ipcRenderer.invoke('toggle-participant', id),

    // Get available visualizations
    getVisualizations: () => ipcRenderer.invoke('get-visualizations'),

    // Launch a visualization in fullscreen
    launchVisualization: (vizId) => ipcRenderer.invoke('launch-visualization', vizId)
});
