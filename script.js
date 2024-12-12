document.addEventListener('DOMContentLoaded', () => {
    const manul = document.getElementById('manul');
    const counter = document.getElementById('counter');
    const energyBar = document.getElementById('energy-bar');
    const upgradeButton = document.getElementById('upgrade-button');
    const upgradeLevelSpan = document.getElementById('upgrade-level');
    const playerLevelSpan = document.getElementById('player-level');
    const nextLevelRequirementSpan = document.getElementById('next-level-requirement');
    const manulizationCard = document.getElementById('manulization-card');
    const manulizationProfitSpan = document.getElementById('manulization-profit');
    const manulizationCostSpan = document.getElementById('manulization-cost');
    const manulizationButton = document.getElementById('manulization-button');
    const tabs = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const profitPerHourSpan = document.getElementById('profit-per-hour');
    const container = document.getElementById('container');
  
    let energy = parseFloat(localStorage.getItem('energy')) || 5000;
    let clicks = parseInt(localStorage.getItem('clicks')) || 0;
    let upgradeLevel = parseInt(localStorage.getItem('upgradeLevel')) || 1;
    let playerLevel = parseInt(localStorage.getItem('playerLevel')) || 1;
    let manulizationLevel = parseInt(localStorage.getItem('manulizationLevel')) || 1;
    let critLevel = parseInt(localStorage.getItem('critLevel')) || 0;
  
    const manulizationProfits = [0, 500, 550, 600, 650, 700, 725, 750, 775, 800, 825];
    const manulizationCosts = [1000, 2000, 5000, 7500, 9000, 14000, 20000, 25000, 35000, 50000];
  
    const levelRequirements = [
        { level: 2, clicks: 5000, energy: 7500 },
        { level: 3, clicks: 10000, energy: 10000 },
        { level: 4, clicks: 15000, energy: 12500 },
        { level: 5, clicks: 30000, energy: 25000 },
        { level: 6, clicks: 50000, energy: 45000 },
        { level: 7, clicks: 100000, energy: 50000 },
        { level: 8, clicks: 250000, energy: 50000 },
        { level: 9, clicks: 500000, energy: 50000 },
        { level: 10, clicks: 1000000, energy: 50000 }
    ];
  
    const critCosts = [200, 1000, 5000];
    const critChances = [0.2, 0.35, 0.4];
    const critMultipliers = [2, 2, 3];
  
    function getNextLevelRequirement() {
        const nextLevel = levelRequirements.find(req => req.level === playerLevel + 1);
        return nextLevel ? nextLevel.clicks : 'MAX';
    }
  
    function getMaxEnergy() {
        const currentLevel = levelRequirements.find(req => req.level === playerLevel);
        return currentLevel ? currentLevel.energy : 5000;
    }
  
    function getUpgradeCost() {
        switch(upgradeLevel) {
            case 1: return 150;  // 1 -> 2
            case 2: return 500;  // 2 -> 3
            case 3: return 1000; // 3 -> 4
            case 4: return 2000; // 4 -> 5
            default: return Infinity; // После 5 уровня прокачка недоступна
        }
    }
  
    function getManulizationCost() {
        return manulizationCosts[manulizationLevel - 1] || Infinity;
    }
  
    function getManulizationProfit() {
        return manulizationProfits[manulizationLevel - 1] || 0;
    }
  
    function formatNumber(num) {
        return Math.floor(num).toString();
    }
  
    function updateEnergy() {
        const lastUpdateTime = parseFloat(localStorage.getItem('lastUpdateTime')) || Date.now();
        const now = Date.now();
        const secondsElapsed = (now - lastUpdateTime) / 1000;
  
        if (energy < getMaxEnergy()) {
            energy += 0.5 * secondsElapsed;
            if (energy > getMaxEnergy()) {
                energy = getMaxEnergy();
            }
            localStorage.setItem('energy', energy);
            energyBar.textContent = `${Math.floor(energy)}/${getMaxEnergy()}⚡`;
            energyBar.style.width = `${(energy / getMaxEnergy()) * 100}%`;
        }
  
        localStorage.setItem('lastUpdateTime', now);
    }
  
    function updateManulizationInfo() {
        const cost = getManulizationCost();
        const profit = getManulizationProfit();
        manulizationCostSpan.textContent = formatNumber(cost);
        manulizationProfitSpan.textContent = formatNumber(profit);
        manulizationButton.disabled = clicks < cost;
        updateProfitPerHour();
    }
  
    function updateProfitPerHour() {
        const profitPerHour = manulizationProfits.slice(0, manulizationLevel).reduce((a, b) => a + b, 0);
        profitPerHourSpan.textContent = `Прибыль в час: ${formatNumber(profitPerHour)}`;
    }
  
    function checkLevelUp() {
        const nextLevel = levelRequirements.find(req => req.level === playerLevel + 1);
        if (nextLevel && clicks >= nextLevel.clicks) {
            playerLevel = nextLevel.level;
            energy = nextLevel.energy;
            localStorage.setItem('playerLevel', playerLevel);
            localStorage.setItem('energy', energy);
            energyBar.textContent = `${Math.floor(energy)}/${getMaxEnergy()}⚡`;
            energyBar.style.width = `${(energy / getMaxEnergy()) * 100}%`;
            playerLevelSpan.textContent = playerLevel;
            nextLevelRequirementSpan.textContent = getNextLevelRequirement();
        }
    }
  
    manul.addEventListener('click', (event) => {
        if (energy >= 1) {
            let clickValue = Math.max(1, upgradeLevel);
            const energyCost = Math.min(energy, clickValue);
            
            // Проверяем крит
            if (critLevel > 0 && Math.random() < critChances[critLevel - 1]) {
                clickValue *= critMultipliers[critLevel - 1];
                
                // Анимация крита
                const critText = document.createElement('div');
                critText.textContent = `КРИТ! x${critMultipliers[critLevel - 1]}`;
                critText.className = 'crit-text';
                critText.style.left = `${event.clientX - container.offsetLeft}px`;
                critText.style.top = `${event.clientY - container.offsetTop}px`;
                container.appendChild(critText);
                
                setTimeout(() => container.removeChild(critText), 1000);
            }
            
            energy -= energyCost;
            clicks += clickValue;
            
            localStorage.setItem('clicks', clicks);
            localStorage.setItem('energy', energy);
            
            counter.textContent = formatNumber(Math.floor(clicks));
            energyBar.textContent = `${Math.floor(energy)}/${getMaxEnergy()}⚡`;
            energyBar.style.width = `${(energy / getMaxEnergy()) * 100}%`;
            
            // Анимация +X
            const plusOne = document.createElement('div');
            plusOne.textContent = `+${formatNumber(clickValue)}`;
            plusOne.className = clickValue > upgradeLevel ? 'plus-one crit' : 'plus-one';
            plusOne.style.left = `${event.clientX - container.offsetLeft}px`;
            plusOne.style.top = `${event.clientY - container.offsetTop}px`;
            container.appendChild(plusOne);
            
            setTimeout(() => container.removeChild(plusOne), 1000);
            
            checkLevelUp();
        }
    });
  
    upgradeButton.addEventListener('click', () => {
        const upgradeCost = getUpgradeCost();
        if (clicks >= upgradeCost && upgradeLevel < 5) {
            clicks -= upgradeCost;
            upgradeLevel++;
            localStorage.setItem('clicks', clicks);
            localStorage.setItem('upgradeLevel', upgradeLevel);
            upgradeLevelSpan.textContent = upgradeLevel;
            counter.textContent = formatNumber(clicks);
            energy = Math.max(0, energy - (upgradeLevel - 1));
            localStorage.setItem('energy', energy);
            energyBar.textContent = `${Math.floor(energy)}/${getMaxEnergy()}⚡`;
            energyBar.style.width = `${(energy / getMaxEnergy()) * 100}%`;
            
            if (upgradeLevel >= 5) {
                upgradeButton.disabled = true;
                upgradeButton.textContent = 'МАКС. УРОВЕНЬ';
            }
            
            updateUpgradeCost();
        }
    });
  
    function updateUpgradeCost() {
        if (upgradeLevel >= 5) {
            upgradeCostValueSpan.textContent = 'МАКС';
        } else {
            upgradeCostValueSpan.textContent = formatNumber(getUpgradeCost());
        }
    }
  
    manulizationButton.addEventListener('click', () => {
        const cost = getManulizationCost();
        if (clicks >= cost && manulizationLevel < 10) {
            clicks -= cost;
            manulizationLevel++;
            localStorage.setItem('clicks', clicks);
            localStorage.setItem('manulizationLevel', manulizationLevel);
            updateManulizationInfo();
            counter.textContent = formatNumber(clicks);
        }
    });
  
    setInterval(() => {
        if (manulizationLevel > 0) {
            const profitPerSecond = manulizationProfits.slice(0, manulizationLevel).reduce((a, b) => a + b, 0) / 3600;
            clicks += profitPerSecond;
            localStorage.setItem('clicks', clicks);
            counter.textContent = formatNumber(clicks);
        }
    }, 1000);
  
    updateEnergy();
    updateManulizationInfo();
    updateProfitPerHour();
    playerLevelSpan.textContent = playerLevel;
    nextLevelRequirementSpan.textContent = getNextLevelRequirement();
    upgradeLevelSpan.textContent = upgradeLevel;
  
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-target');
            tabContents.forEach(content => {
                content.style.display = content.id === targetId ? 'block' : 'none';
            });
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
  
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            updateEnergy();
        }
    });
  
    setInterval(() => {
        updateEnergy();
    }, 1000);
  
    function initialize() {
        updateEnergy();
        updateManulizationInfo();
        updateProfitPerHour();
        playerLevelSpan.textContent = playerLevel;
        nextLevelRequirementSpan.textContent = getNextLevelRequirement();
        upgradeLevelSpan.textContent = upgradeLevel;
    }
  
    initialize();
  
    // Функция для показа уведомления
    function showNotification(message) {
        // Проверяем, запущено ли приложение в Telegram WebApp
        if (window.Telegram && window.Telegram.WebApp) {
            // Используем нативное уведомление Telegram
            window.Telegram.WebApp.showPopup({
                title: 'Офлайн прибыль',
                message: message,
                buttons: [{
                    type: 'ok'
                }]
            });
        } else {
            // Создаем собственное уведомление для браузера
            const notification = document.createElement('div');
            notification.className = 'custom-notification';
            notification.innerHTML = `
                <div class="notification-content">
                    <h3>Офлайн прибыль</h3>
                    <p>${message}</p>
                    <button onclick="this.parentElement.parentElement.remove()">OK</button>
                </div>
            `;
            document.body.appendChild(notification);
            
            // Автоматически скрываем через 5 секунд
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 5000);
        }
    }
  
    // Обновляем функцию calculateOfflineProgress
  
    const critLevelSpan = document.getElementById('crit-level');
    const critCostSpan = document.getElementById('crit-cost');
    const critButton = document.getElementById('crit-button');
  
    // Обработчик кнопки прокачки крита
    if (critButton) {
        critButton.addEventListener('click', () => {
            console.log('Кнопка нажата');
            const cost = critLevel < 3 ? critCosts[critLevel] : Infinity;
            
            if (clicks >= cost && critLevel < 3) {
                clicks -= cost;
                critLevel++;
                
                // Сохраняем прогресс
                localStorage.setItem('clicks', clicks);
                localStorage.setItem('critLevel', critLevel);
                
                // Обновляем отображение
                counter.textContent = formatNumber(Math.floor(clicks));
                
                // Обновляем информацию о критах
                critLevelSpan.textContent = critLevel;
                critCostSpan.textContent = critLevel < 3 ? formatNumber(critCosts[critLevel]) : 'МАКС';
                
                console.log('Крит улучшен до уровня:', critLevel);
            }
        });
    }
  
    // Функция обновления информации о критах
    function updateCritInfo() {
        if (critLevelSpan && critCostSpan) {
            critLevelSpan.textContent = critLevel;
            critCostSpan.textContent = critLevel < 3 ? formatNumber(critCosts[critLevel]) : 'МАКС';
        }
    }
  
    // Вызываем обновление при загрузке
    updateCritInfo();
  
    // Обновляем функцию расчета офлайн прогресса
    function calculateOfflineProgress() {
        const lastVisitTime = parseInt(localStorage.getItem('lastVisitTime')) || Date.now();
        const currentTime = Date.now();
        const timeDifferenceInSeconds = (currentTime - lastVisitTime) / 1000;
        
        if (timeDifferenceInSeconds > 0 && manulizationLevel > 0) {
            const profitPerHour = manulizationProfits.slice(0, manulizationLevel).reduce((a, b) => a + b, 0);
            const offlineEarnings = Math.floor((profitPerHour / 3600) * timeDifferenceInSeconds);
            
            if (offlineEarnings > 0) {
                clicks += offlineEarnings;
                localStorage.setItem('clicks', clicks);
                counter.textContent = formatNumber(clicks);
                
                showNotification(`Пока вас не было, вы заработали ${formatNumber(offlineEarnings)} манулов!`);
            }
        }
        
        localStorage.setItem('lastVisitTime', Date.now());
    }
  
    // Сохраняем время перед закрытием страницы
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('lastVisitTime', Date.now());
    });
  
    // Вызываем расчет офлайн прогресса при загрузке страницы
    calculateOfflineProgress();
});
