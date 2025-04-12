// Cosmic Collector - Game Logic

// Game state
const gameState = {
    energy: 0,
    energyPerClick: 1,
    energyPerSecond: 0,
    lastSave: Date.now(),
    upgrades: [],
    achievements: [],
    galaxies: [],
    activeGalaxy: 'solar-system',
    totalClicks: 0,
    totalEnergy: 0
};

// Game configuration
const gameConfig = {
    saveInterval: 30000, // Auto-save every 30 seconds
    particleCount: 10,
    clickAnimationDuration: 1000,
    upgradeBaseCost: 10,
    upgradeCostMultiplier: 1.15,
    galaxyCostMultiplier: 10
};

// DOM Elements
const elements = {
    energyCount: document.getElementById('energy-count'),
    energyPerSecond: document.getElementById('energy-per-second'),
    clickArea: document.getElementById('click-area'),
    clickValue: document.getElementById('click-value'),
    clickParticles: document.getElementById('click-particles'),
    upgradesContainer: document.getElementById('upgrades-container'),
    achievementsContainer: document.getElementById('achievements-container'),
    galaxiesContainer: document.getElementById('galaxies-container'),
    saveButton: document.getElementById('save-game'),
    resetButton: document.getElementById('reset-game'),
    achievementModal: document.getElementById('achievement-modal'),
    galaxyModal: document.getElementById('galaxy-modal'),
    achievementDetails: document.getElementById('achievement-details'),
    galaxyDetails: document.getElementById('galaxy-details'),
    mainPlanet: document.getElementById('main-planet')
};

// Close modal buttons
document.querySelectorAll('.close-modal').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    });
});

// Upgrades data
const upgradesData = [
    {
        id: 'satellite',
        name: 'Satellite',
        description: 'Un piccolo satellite che raccoglie energia cosmica',
        icon: 'fa-satellite',
        baseCost: 10,
        baseProduction: 0.1,
        unlockEnergy: 0
    },
    {
        id: 'space-station',
        name: 'Stazione Spaziale',
        description: 'Una stazione spaziale che orbita intorno al pianeta',
        icon: 'fa-space-station-moon-alt',
        baseCost: 50,
        baseProduction: 0.5,
        unlockEnergy: 30
    },
    {
        id: 'telescope',
        name: 'Telescopio Spaziale',
        description: 'Un potente telescopio che individua fonti di energia',
        icon: 'fa-telescope',
        baseCost: 200,
        baseProduction: 2,
        unlockEnergy: 150
    },
    {
        id: 'rover',
        name: 'Rover Planetario',
        description: 'Un rover che esplora la superficie del pianeta',
        icon: 'fa-rover',
        baseCost: 1000,
        baseProduction: 10,
        unlockEnergy: 500
    },
    {
        id: 'mining-station',
        name: 'Stazione di Estrazione',
        description: 'Estrae energia direttamente dal nucleo del pianeta',
        icon: 'fa-broadcast-tower',
        baseCost: 5000,
        baseProduction: 50,
        unlockEnergy: 3000
    },
    {
        id: 'quantum-collector',
        name: 'Collettore Quantico',
        description: 'Sfrutta le fluttuazioni quantistiche per generare energia',
        icon: 'fa-atom',
        baseCost: 25000,
        baseProduction: 250,
        unlockEnergy: 15000
    },
    {
        id: 'dyson-sphere',
        name: 'Sfera di Dyson',
        description: 'Una megastruttura che circonda la stella per raccogliere energia',
        icon: 'fa-sun',
        baseCost: 100000,
        baseProduction: 1000,
        unlockEnergy: 50000
    }
];

// Achievements data
const achievementsData = [
    {
        id: 'first-click',
        name: 'Primo Contatto',
        description: 'Hai fatto il tuo primo click',
        icon: 'fa-hand-pointer',
        condition: state => state.totalClicks >= 1
    },
    {
        id: 'click-master',
        name: 'Click Master',
        description: 'Hai fatto 100 click',
        icon: 'fa-hand-point-up',
        condition: state => state.totalClicks >= 100
    },
    {
        id: 'energy-collector',
        name: 'Collezionista di Energia',
        description: 'Hai raccolto 1,000 unità di energia',
        icon: 'fa-bolt',
        condition: state => state.totalEnergy >= 1000
    },
    {
        id: 'energy-tycoon',
        name: 'Magnate dell\'Energia',
        description: 'Hai raccolto 10,000 unità di energia',
        icon: 'fa-solar-panel',
        condition: state => state.totalEnergy >= 10000
    },
    {
        id: 'upgrade-novice',
        name: 'Apprendista Tecnologico',
        description: 'Hai acquistato il tuo primo potenziamento',
        icon: 'fa-arrow-up',
        condition: state => state.upgrades.some(u => u.level > 0)
    },
    {
        id: 'upgrade-master',
        name: 'Maestro dei Potenziamenti',
        description: 'Hai acquistato 10 livelli di potenziamenti',
        icon: 'fa-arrow-circle-up',
        condition: state => state.upgrades.reduce((total, u) => total + u.level, 0) >= 10
    },
    {
        id: 'galaxy-explorer',
        name: 'Esploratore Galattico',
        description: 'Hai sbloccato la tua prima galassia',
        icon: 'fa-galaxy',
        condition: state => state.galaxies.some(g => g.id !== 'solar-system' && g.unlocked)
    }
];

// Galaxies data
const galaxiesData = [
    {
        id: 'solar-system',
        name: 'Sistema Solare',
        description: 'Il nostro sistema solare, casa della Terra',
        cost: 0,
        multiplier: 1,
        color: '#4776e6',
        unlocked: true
    },
    {
        id: 'andromeda',
        name: 'Andromeda',
        description: 'La galassia più vicina alla Via Lattea',
        cost: 5000,
        multiplier: 2,
        color: '#8e54e9',
        unlocked: false
    },
    {
        id: 'triangulum',
        name: 'Triangolo',
        description: 'La terza galassia più grande del Gruppo Locale',
        cost: 20000,
        multiplier: 3,
        color: '#ff9a9e',
        unlocked: false
    },
    {
        id: 'sombrero',
        name: 'Sombrero',
        description: 'Una galassia a spirale con un nucleo luminoso',
        cost: 100000,
        multiplier: 5,
        color: '#fad0c4',
        unlocked: false
    },
    {
        id: 'whirlpool',
        name: 'Vortice',
        description: 'Una classica galassia a spirale',
        cost: 500000,
        multiplier: 8,
        color: '#a1c4fd',
        unlocked: false
    },
    {
        id: 'black-eye',
        name: 'Occhio Nero',
        description: 'Una galassia con una banda scura di polvere',
        cost: 2000000,
        multiplier: 13,
        color: '#6a11cb',
        unlocked: false
    }
];

// Initialize game
function initGame() {
    // Load saved game or initialize new game
    loadGame();
    
    // Initialize upgrades if not present
    if (gameState.upgrades.length === 0) {
        gameState.upgrades = upgradesData.map(upgrade => ({
            id: upgrade.id,
            level: 0,
            cost: upgrade.baseCost,
            production: 0
        }));
    }
    
    // Initialize achievements if not present
    if (gameState.achievements.length === 0) {
        gameState.achievements = achievementsData.map(achievement => ({
            id: achievement.id,
            unlocked: false
        }));
    }
    
    // Initialize galaxies if not present
    if (gameState.galaxies.length === 0) {
        gameState.galaxies = galaxiesData.map(galaxy => ({
            id: galaxy.id,
            unlocked: galaxy.unlocked
        }));
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Render initial game state
    renderGame();
    
    // Start game loops
    startGameLoops();
}

// Set up event listeners
function setupEventListeners() {
    // Click area
    elements.clickArea.addEventListener('click', handleClick);
    
    // Save button
    elements.saveButton.addEventListener('click', () => {
        saveGame();
        showNotification('Gioco salvato!');
    });
    
    // Reset button
    elements.resetButton.addEventListener('click', () => {
        if (confirm('Sei sicuro di voler resettare il gioco? Tutti i progressi andranno persi!')) {
            resetGame();
            showNotification('Gioco resettato!');
        }
    });
}

// Handle click on the main planet
function handleClick(event) {
    // Increase energy
    const currentGalaxy = galaxiesData.find(g => g.id === gameState.activeGalaxy);
    const clickValue = gameState.energyPerClick * (currentGalaxy ? currentGalaxy.multiplier : 1);
    
    gameState.energy += clickValue;
    gameState.totalEnergy += clickValue;
    gameState.totalClicks++;
    
    // Show click value animation
    showClickValue(event, clickValue);
    
    // Create particles
    createClickParticles(event);
    
    // Check for achievements
    checkAchievements();
    
    // Update display
    updateDisplay();
}

// Show click value animation
function showClickValue(event, value) {
    const clickValue = elements.clickValue;
    
    // Set position
    const rect = elements.clickArea.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    clickValue.style.left = `${x}px`;
    clickValue.style.top = `${y}px`;
    clickValue.textContent = `+${formatNumber(value)}`;
    
    // Show and animate
    clickValue.style.opacity = '1';
    clickValue.style.transform = 'translateY(0)';
    
    // Animate upward and fade out
    setTimeout(() => {
        clickValue.style.opacity = '0';
        clickValue.style.transform = 'translateY(-30px)';
    }, 50);
}

// Create particles on click
function createClickParticles(event) {
    const rect = elements.clickArea.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    for (let i = 0; i < gameConfig.particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size
        const size = Math.random() * 10 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position around click
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 30 + 10;
        const particleX = x + Math.cos(angle) * distance;
        const particleY = y + Math.sin(angle) * distance;
        
        particle.style.left = `${particleX}px`;
        particle.style.top = `${particleY}px`;
        
        // Add to container
        elements.clickParticles.appendChild(particle);
        
        // Animate
        const speedX = (Math.random() - 0.5) * 3;
        const speedY = (Math.random() - 0.5) * 3;
        let opacity = 1;
        
        const animate = () => {
            if (opacity <= 0) {
                particle.remove();
                return;
            }
            
            const currentX = parseFloat(particle.style.left);
            const currentY = parseFloat(particle.style.top);
            
            particle.style.left = `${currentX + speedX}px`;
            particle.style.top = `${currentY + speedY}px`;
            
            opacity -= 0.05;
            particle.style.opacity = opacity;
            
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }
}

// Buy upgrade
function buyUpgrade(upgradeId) {
    const upgradeIndex = gameState.upgrades.findIndex(u => u.id === upgradeId);
    if (upgradeIndex === -1) return;
    
    const upgrade = gameState.upgrades[upgradeIndex];
    const upgradeData = upgradesData.find(u => u.id === upgradeId);
    
    if (gameState.energy >= upgrade.cost) {
        // Deduct cost
        gameState.energy -= upgrade.cost;
        
        // Increase level
        upgrade.level++;
        
        // Update production
        upgrade.production = upgradeData.baseProduction * upgrade.level;
        
        // Update cost for next level
        upgrade.cost = Math.floor(upgradeData.baseCost * Math.pow(gameConfig.upgradeCostMultiplier, upgrade.level));
        
        // Update total production
        calculateTotalProduction();
        
        // Check for achievements
        checkAchievements();
        
        // Update display
        updateDisplay();
        renderUpgrades();
        
        // Show notification
        showNotification(`Hai acquistato ${upgradeData.name} livello ${upgrade.level}!`);
    } else {
        showNotification('Energia insufficiente!', 'error');
    }
}

// Unlock galaxy
function unlockGalaxy(galaxyId) {
    const galaxyIndex = gameState.galaxies.findIndex(g => g.id === galaxyId);
    if (galaxyIndex === -1) return;
    
    const galaxy = gameState.galaxies[galaxyIndex];
    const galaxyData = galaxiesData.find(g => g.id === galaxyId);
    
    if (galaxy.unlocked) {
        // Switch to this galaxy
        gameState.activeGalaxy = galaxyId;
        updateGalaxyTheme(galaxyData);
        renderGalaxies();
        showNotification(`Sei passato alla galassia ${galaxyData.name}!`);
    } else if (gameState.energy >= galaxyData.cost) {
        // Unlock new galaxy
        gameState.energy -= galaxyData.cost;
        galaxy.unlocked = true;
        gameState.activeGalaxy = galaxyId;
        
        // Update theme
        updateGalaxyTheme(galaxyData);
        
        // Check for achievements
        checkAchievements();
        
        // Update display
        updateDisplay();
        renderGalaxies();
        
        // Show galaxy unlocked modal
        showGalaxyUnlockedModal(galaxyData);
    } else {
        showNotification('Energia insufficiente!', 'error');
    }
}

// Update galaxy theme
function updateGalaxyTheme(galaxyData) {
    // Change planet color
    elements.mainPlanet.style.background = `radial-gradient(circle at 30% 30%, ${galaxyData.color}, #4776e6)`;
}

// Calculate total production per second
function calculateTotalProduction() {
    const currentGalaxy = galaxiesData.find(g => g.id === gameState.activeGalaxy);
    const multiplier = currentGalaxy ? currentGalaxy.multiplier : 1;
    
    gameState.energyPerSecond = gameState.upgrades.reduce((total, upgrade) => {
        return total + upgrade.production;
    }, 0) * multiplier;
}

// Check for achievements
function checkAchievements() {
    let newAchievements = false;
    
    achievementsData.forEach(achievementData => {
        const achievement = gameState.achievements.find(a => a.id === achievementData.id);
        
        if (achievement && !achievement.unlocked && achievementData.condition(gameState)) {
            achievement.unlocked = true;
            newAchievements = true;
            
            // Show achievement notification
            showAchievementUnlockedModal(achievementData);
        }
    });
    
    if (newAchievements) {
        renderAchievements();
    }
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Show achievement unlocked modal
function showAchievementUnlockedModal(achievementData) {
    elements.achievementDetails.innerHTML = `
        <div class="achievement">
            <div class="achievement-icon"><i class="fas ${achievementData.icon}"></i></div>
            <div class="achievement-name">${achievementData.name}</div>
            <div class="achievement-description">${achievementData.description}</div>
        </div>
    `;
    
    elements.achievementModal.style.display = 'flex';
    
    // Auto-close after delay
    setTimeout(() => {
        elements.achievementModal.style.display = 'none';
    }, 5000);
}

// Show galaxy unlocked modal
function showGalaxyUnlockedModal(galaxyData) {
    elements.galaxyDetails.innerHTML = `
        <div class="galaxy" style="background: linear-gradient(135deg, ${galaxyData.color}33, #24243e);">
            <div class="galaxy-name">${galaxyData.name}</div>
            <div class="galaxy-description">${galaxyData.description}</div>
            <div class="galaxy-bonus">Bonus produzione: x${galaxyData.multiplier}</div>
        </div>
        <p>Hai sbloccato una nuova galassia! La produzione di energia è ora moltiplicata per ${galaxyData.multiplier}.</p>
    `;
    
    elements.galaxyModal.style.display = 'flex';
    
    // Auto-close after delay
    setTimeout(() => {
        elements.galaxyModal.style.display = 'none';
    }, 5000);
}

// Update display
function updateDisplay() {
    elements.energyCount.textContent = formatNumber(gameState.energy);
    elements.energyPerSecond.textContent = formatNumber(gameState.energyPerSecond);
}

// Render upgrades
function renderUpgrades() {
    elements.upgradesContainer.innerHTML = '';
    
    upgradesData.forEach(upgradeData => {
        const upgrade = gameState.upgrades.find(u => u.id === upgradeData.id);
        
        // Check if upgrade should be visible
        if (gameState.totalEnergy < upgradeData.unlockEnergy) {
            return;
        }
        
        const upgradeElement = document.createElement('div');
        upgradeElement.classList.add('upgrade-item');
        
        if (gameState.energy < upgrade.cost) {
            upgradeElement.classList.add('disabled');
        }
        
        upgradeElement.innerHTML = `
            <div class="upgrade-icon"><i class="fas ${upgradeData.icon}"></i></div>
            <div class="upgrade-info">
                <div class="upgrade-name">${upgradeData.name}</div>
                <div class="upgrade-description">${upgradeData.description}</div>
                <div class="upgrade-level">Livello: ${upgrade.level} | Produzione: ${formatNumber(upgrade.production)}/sec</div>
            </div>
            <div class="upgrade-cost">${formatNumber(upgrade.cost)}</div>
        `;
        
        upgradeElement.addEventListener('click', () => {
            buyUpgrade(upgradeData.id);
        });
        
        elements.upgradesContainer.appendChild(upgradeElement);
    });
}

// Render achievements
function renderAchievements() {
    elements.achievementsContainer.innerHTML = '';
    
    achievementsData.forEach(achievementData => {
        const achievement = gameState.achievements.find(a => a.id === achievementData.id);
        
        const achievementElement = document.createElement('div');
        achievementElement.classList.add('achievement');
        
        if (!achievement.unlocked) {
            achievementElement.classList.add('locked');
        }
        
        achievementElement.innerHTML = `
            <div class="achievement-icon"><i class="fas ${achievementData.icon}"></i></div>
            <div class="achievement-name">${achievementData.name}</div>
            <div class="achievement-description">${achievement.unlocked ? achievementData.description : '???'}</div>
        `;
        
        elements.achievementsContainer.appendChild(achievementElement);
    });
}

// Render galaxies
function renderGalaxies() {
    elements.galaxiesContainer.innerHTML = '';
    
    galaxiesData.forEach(galaxyData => {
        const galaxy = gameState.galaxies.find(g => g.id === galaxyData.id);
        
        const galaxyElement = document.createElement('div');
        galaxyElement.classList.add('galaxy');
        galaxyElement.style.background = `linear-gradient(135deg, ${galaxyData.color}33, #24243e)`;
        
        if (!galaxy.unlocked) {
            galaxyElement.classList.add('locked');
        }
        
        // Add active class to current galaxy
        if (gameState.activeGalaxy === galaxyData.id) {
            galaxyElement.classList.add('active');
            galaxyElement.style.boxShadow = `0 0 15px ${galaxyData.color}`;
        }
        
        galaxyElement.innerHTML = `
            <div class="galaxy-name">${galaxyData.name}</div>
            <div class="galaxy-description">${galaxy.unlocked ? galaxyData.description : '???'}</div>
            ${!galaxy.unlocked ? `<div class="galaxy-cost">${formatNumber(galaxyData.cost)}</div>` : 
            `<div class="galaxy-bonus">x${galaxyData.multiplier}</div>`}
        `;
        
        galaxyElement.addEventListener('click', () => {
            unlockGalaxy(galaxyData.id);
        });
        
        elements.galaxiesContainer.appendChild(galaxyElement);
    });
}

// Format number for display
function formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return Math.floor(num);
}

// Game loop - production
function productionLoop() {
    const now = Date.now();
    const deltaTime = (now - gameState.lastUpdate) / 1000;
    gameState.lastUpdate = now;
    
    // Add energy from production
    const energyGain = gameState.energyPerSecond * deltaTime;
    gameState.energy += energyGain;
    gameState.totalEnergy += energyGain;
    
    // Check for achievements
    checkAchievements();
    
    // Update display
    updateDisplay();
}

// Game loop - auto-save
function autoSaveLoop() {
    const now = Date.now();
    
    if (now - gameState.lastSave >= gameConfig.saveInterval) {
        saveGame();
        gameState.lastSave = now;
    }
}

// Start game loops
function startGameLoops() {
    // Set initial timestamp
    gameState.lastUpdate = Date.now();
    
    // Production loop - 60fps
    setInterval(productionLoop, 1000 / 60);
    
    // Auto-save loop - check every second
    setInterval(autoSaveLoop, 1000);
    
    // Render loop - update UI every second
    setInterval(() => {
        renderUpgrades();
        renderAchievements();
        renderGalaxies();
    }, 1000);
}

// Save game
function saveGame() {
    localStorage.setItem('cosmicCollector', JSON.stringify(gameState));
}

// Load game
function loadGame() {
    const savedGame = localStorage.getItem('cosmicCollector');
    
    if (savedGame) {
        const parsedSave = JSON.parse(savedGame);
        
        // Merge saved state with default state
        Object.assign(gameState, parsedSave);
        
        // Set last update to now
        gameState.lastUpdate = Date.now();
        
        // Recalculate production
        calculateTotalProduction();
    } else {
        // Initialize with default values
        gameState.lastUpdate = Date.now();
        gameState.lastSave = Date.now();
    }
}

// Reset game
function resetGame() {
    localStorage.removeItem('cosmicCollector');
    location.reload();
}

// Render game
function renderGame() {
    updateDisplay();
    renderUpgrades();
    renderAchievements();
    renderGalaxies();
    
    // Set initial galaxy theme
    const currentGalaxy = galaxiesData.find(g => g.id === gameState.activeGalaxy);
    if (currentGalaxy) {
        updateGalaxyTheme(currentGalaxy);
    }
}

// Add CSS for notifications
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        background: var(--success-color);
    }
    
    .notification-error {
        background: var(--danger-color);
    }
    
    .notification-info {
        background: var(--secondary-color);
    }
`;
document.head.appendChild(notificationStyle);

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);