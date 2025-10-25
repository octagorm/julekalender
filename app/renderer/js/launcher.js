// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', async () => {
    await loadParticipants();
    await loadVisualizations();

    setupEventListeners();
});

function setupEventListeners() {
    // Add participant button
    document.getElementById('add-participant-btn').addEventListener('click', () => {
        showAddForm();
    });

    // Save participant
    document.getElementById('save-participant-btn').addEventListener('click', async () => {
        await saveParticipant();
    });

    // Cancel add
    document.getElementById('cancel-participant-btn').addEventListener('click', () => {
        hideAddForm();
    });

    // Enter key to save
    document.getElementById('new-participant-name').addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            await saveParticipant();
        }
    });
}

function showAddForm() {
    document.getElementById('add-participant-form').style.display = 'block';
    document.getElementById('new-participant-name').value = '';
    document.getElementById('new-participant-name').focus();
}

function hideAddForm() {
    document.getElementById('add-participant-form').style.display = 'none';
}

async function saveParticipant() {
    const nameInput = document.getElementById('new-participant-name');
    const name = nameInput.value.trim();

    if (!name) {
        alert('Vennligst skriv inn et navn');
        return;
    }

    try {
        await window.julekalenderAPI.addParticipant(name);
        hideAddForm();
        await loadParticipants();
    } catch (error) {
        console.error('Error adding participant:', error);
        alert('Kunne ikke legge til deltaker');
    }
}

async function loadParticipants() {
    try {
        const participants = await window.julekalenderAPI.getParticipants();
        const participantsList = document.getElementById('participants-list');
        const countDisplay = document.getElementById('names-count');

        if (participants.length === 0) {
            participantsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <div class="empty-state-title">Ingen deltakere</div>
                    <div class="empty-state-message">Klikk "+ Legg til" for å legge til deltakere</div>
                </div>
            `;
            countDisplay.querySelector('.count-number').textContent = '0';
            countDisplay.querySelector('.count-total').textContent = '0';
            return;
        }

        // Render participant list
        participantsList.innerHTML = participants.map(p => `
            <div class="participant-item ${p.enabled ? '' : 'disabled'}">
                <input
                    type="checkbox"
                    class="participant-checkbox"
                    ${p.enabled ? 'checked' : ''}
                    onchange="toggleParticipant(${p.id})"
                >
                <span class="participant-name">${escapeHtml(p.name)}</span>
                <div class="participant-actions">
                    <button class="icon-button delete" onclick="deleteParticipant(${p.id})" title="Slett">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');

        // Update counts
        const activeCount = participants.filter(p => p.enabled).length;
        countDisplay.querySelector('.count-number').textContent = activeCount;
        countDisplay.querySelector('.count-total').textContent = participants.length;

    } catch (error) {
        console.error('Error loading participants:', error);
        document.getElementById('participants-list').innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <div class="empty-state-title">Kunne ikke laste deltakere</div>
                <div class="empty-state-message">${error.message}</div>
            </div>
        `;
    }
}

async function toggleParticipant(id) {
    try {
        await window.julekalenderAPI.toggleParticipant(id);
        await loadParticipants();
    } catch (error) {
        console.error('Error toggling participant:', error);
        alert('Kunne ikke endre status');
    }
}

async function deleteParticipant(id) {
    if (!confirm('Er du sikker på at du vil slette denne deltakeren?')) {
        return;
    }

    try {
        await window.julekalenderAPI.deleteParticipant(id);
        await loadParticipants();
    } catch (error) {
        console.error('Error deleting participant:', error);
        alert('Kunne ikke slette deltaker');
    }
}

async function loadVisualizations() {
    try {
        const visualizations = await window.julekalenderAPI.getVisualizations();
        const vizGrid = document.getElementById('viz-grid');

        if (visualizations.length === 0) {
            vizGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🎮</div>
                    <div class="empty-state-title">Ingen visualiseringer funnet</div>
                    <div class="empty-state-message">Legg til visualiseringer i /visualizations mappen</div>
                </div>
            `;
            return;
        }

        // Render visualization cards
        vizGrid.innerHTML = visualizations.map(viz => `
            <div class="viz-card" onclick="launchViz('${viz.id}')">
                <div class="viz-icon">${viz.icon}</div>
                <div class="viz-name">${escapeHtml(viz.name)}</div>
                <div class="viz-description">${escapeHtml(viz.description)}</div>
                <div class="viz-actions">
                    <button class="button full-width" onclick="event.stopPropagation(); launchViz('${viz.id}')">
                        Start
                    </button>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading visualizations:', error);
        document.getElementById('viz-grid').innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <div class="empty-state-title">Kunne ikke laste visualiseringer</div>
                <div class="empty-state-message">${error.message}</div>
            </div>
        `;
    }
}

function launchViz(vizId) {
    window.julekalenderAPI.launchVisualization(vizId);
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
