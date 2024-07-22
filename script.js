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
  let lastUpdateTime = parseFloat(localStorage.getItem('lastUpdateTime')) || Date.now();

  const manulizationProfits = [500, 550, 600, 650, 700, 725, 750, 775, 800, 825];
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

  function getNextLevelRequirement() {
      const nextLevel = levelRequirements.find(req => req.level === playerLevel + 1);
      return nextLevel ? nextLevel.clicks : 'MAX';
  }

  function getMaxEnergy() {
      const currentLevel = levelRequirements.find(req => req.level === playerLevel);
      return currentLevel ? currentLevel.energy : 5000;
  }

  function getUpgradeCost() {
      if (upgradeLevel <= 10) return 150;
      if (upgradeLevel <= 20) return 500;
      if (upgradeLevel <= 30) return 1000;
      return 2000;
  }

  function getManulizationCost() {
      return manulizationCosts[manulizationLevel - 1] || Infinity;
  }

  function getManulizationProfit() {
      return manulizationProfits[manulizationLevel - 1] || 0;
  }

  function formatNumber(num) {
      return num.toLocaleString();
  }

  function updateEnergy() {
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
      const profitPerHour = getManulizationProfit();
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
      if (energy > 0) {
          let clickValue = upgradeLevel;
          energy -= clickValue;
          clicks += clickValue;
          localStorage.setItem('clicks', clicks);
          localStorage.setItem('energy', energy);
          counter.textContent = formatNumber(clicks);
          energyBar.textContent = `${Math.floor(energy)}/${getMaxEnergy()}⚡`;
          energyBar.style.width = `${(energy / getMaxEnergy()) * 100}%`;

          const plusOne = document.createElement('div');
          plusOne.textContent = `+${clickValue}`;
          plusOne.className = 'plus-one';
          plusOne.style.left = `${event.clientX - container.offsetLeft}px`;
          plusOne.style.top = `${event.clientY - container.offsetTop}px`;
          container.appendChild(plusOne);

          setTimeout(() => {
              container.removeChild(plusOne);
          }, 1000);

          manul.classList.add('clicked');
          setTimeout(() => {
              manul.classList.remove('clicked');
          }, 100);

          checkLevelUp();
      }
  });

  upgradeButton.addEventListener('click', () => {
      const upgradeCost = getUpgradeCost();
      if (clicks >= upgradeCost) {
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
          updateUpgradeCost();
      }
  });

  function updateUpgradeCost() {
      upgradeCostValueSpan.textContent = formatNumber(getUpgradeCost());
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
          const now = Date.now();
          const secondsElapsed = (now - lastUpdateTime) / 1000;
          const profitPerSecond = getManulizationProfit() / 3600;
          clicks += profitPerSecond * secondsElapsed;
          localStorage.setItem('clicks', clicks);
          counter.textContent = formatNumber(clicks);
          lastUpdateTime = now;
          localStorage.setItem('lastUpdateTime', lastUpdateTime);
      }
  }, 1000);

  updateEnergy();
  updateManulizationInfo();
  updateProfitPerHour();
  playerLevelSpan.textContent = playerLevel;
  nextLevelRequirementSpan.textContent = getNextLevelRequirement();
  upgradeLevelSpan.textContent = upgradeLevel;

  // Переключение вкладок
  tabs.forEach(tab => {
      tab.addEventListener('click', () => {
          const targetId = tab.getAttribute('data-target');
          tabContents.forEach(content => {
              if (content.id === targetId) {
                  content.classList.add('active');
              } else {
                  content.classList.remove('active');
              }
          });
      });
  });
});
