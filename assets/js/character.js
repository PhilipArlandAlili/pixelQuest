let playerData; // 🔁 Moved to global scope

const questChain = [
    { key: 'slime', target: 3, description: 'Defeat Slimes', reward: 25 },
    { key: 'wolf', target: 5, description: 'Defeat Wolves', reward: 50 },
    { key: 'jessica', target: 1, description: 'Defeat Jessica', reward: 100 },
    { key: 'dragon', target: 1, description: 'Defeat Dragon', reward: 150 }
];

const heroTales = {
    warrior: {
        img: 'assets/img/warrior.gif',
        taleTitle: "Warrior's Tale",
        taleText: [
            "A fearless warrior from the northern lands.",
            "Famed for unmatched strength and courage in battle.",
            "He defends the weak and fights for honor."
        ],
        quote: '"Strength and honor guide my blade."',
        questChain: questChain
    },
    wizard: {
        img: 'assets/img/wizard.gif',
        taleTitle: "Wizard's Tale",
        taleText: [
            "A wise wizard mastering arcane forces.",
            "Commands elemental magic to vanquish foes.",
            "Seeks knowledge and balance in the world."
        ],
        quote: '"Magic flows where the mind leads."',
        questChain: questChain
    },
    slime: {
        img: 'assets/img/slime.gif',
        taleTitle: "Slime's Tale",
        taleText: [
            "A quick and agile slime creature.",
            "Master of evasion and ranged combat.",
            "Surprises enemies with unexpected tactics."
        ],
        quote: '"Small but deadly."',
        questChain: questChain
    }
};

function getQuestText(quest, playerData) {
    const kills = playerData.kills?.[quest.key] || 0;
    const remaining = Math.max(quest.target - kills, 0);
    return remaining === 0
        ? `${quest.description} (Completed!)`
        : `Defeat ${remaining} ${quest.key}${remaining > 1 ? 's' : ''}`;
}

const swordLevels = [
    { level: 1, name: "Ironfang Blade", description: "A reliable iron sword passed down by village warriors. Sturdy and sharp.", price: 150, image: "assets/img/items/l1-sword.png", effect: { attack: 10 } },
    { level: 2, name: "Steelfang Saber", description: "Forged with refined steel, this saber bites deeper with every strike.", price: 300, image: "assets/img/items/l2-sword.png", effect: { attack: 20 } },
    { level: 3, name: "Kingsplitter Edge", description: "A gleaming blade said to have cleaved a tyrant's crown in a single blow.", price: 600, image: "assets/img/items/l3-sword.png", effect: { attack: 40 } },
    { level: 4, name: "Blade of the Eternal Oath", description: "A mythical sword that radiates ancient power, bound by a sacred vow of vengeance.", price: 1200, image: "assets/img/items/l4-sword.png", effect: { attack: 80 } }
];

const staffLevels = [
    { level: 1, name: "Emberwood Staff I", description: "A charred wooden staff warm to the touch, crackling with embers.", price: 150, image: "assets/img/items/l1-staff.png", effect: { attack: 10 } },
    { level: 2, name: "Blazing Branch II", description: "This staff glows with a steady flame, scorching anything nearby.", price: 300, image: "assets/img/items/l2-staff.png", effect: { attack: 20 } },
    { level: 3, name: "Inferno Rod III", description: "Forged in dragonfire, this rod unleashes waves of searing heat.", price: 600, image: "assets/img/items/l3-staff.png", effect: { attack: 40 } },
    { level: 4, name: "Hellfire Staff IV", description: "A legendary staff wreathed in eternal flames, born from volcanic fury.", price: 1200, image: "assets/img/items/l4-staff.png", effect: { attack: 80 } }
];

const slimeLevels = [
    { level: 1, name: "slime of Valor I", description: "A basic mighty blade that boosts your attack power moderately.", price: 150, image: "assets/img/items/l1-sword.png", effect: { attack: 10 } },
    { level: 2, name: "slime of Valor II", description: "A stronger blade with enhanced attack power.", price: 300, image: "assets/img/items/l2-sword.png", effect: { attack: 20 } },
    { level: 3, name: "slime of Valor III", description: "A powerful blade that greatly boosts your attack.", price: 600, image: "assets/img/items/l3-sword.png", effect: { attack: 40 } },
    { level: 4, name: "slime of Valor IV", description: "The ultimate sword with devastating attack power.", price: 1200, image: "assets/img/items/l4-sword.png", effect: { attack: 80 } }
];

const armorLevels = [
    { level: 1, name: "Steel Armor I", description: "Basic steel armor that provides moderate physical defense.", price: 200, image: "assets/img/items/l1-armor.png", effect: { defense: 10 } },
    { level: 2, name: "Steel Armor II", description: "Sturdy steel armor with enhanced defense.", price: 400, image: "assets/img/items/l2-armor.png", effect: { defense: 20 } },
    { level: 3, name: "Steel Armor III", description: "Heavy steel armor that greatly boosts your defense.", price: 800, image: "assets/img/items/l3-armor.png", effect: { defense: 40 } },
    { level: 4, name: "Steel Armor IV", description: "The ultimate armor with exceptional physical defense.", price: 1600, image: "assets/img/items/l4-armor.png", effect: { defense: 80 } }
];

const storeItemsBase = [
    { name: "Health Potion", description: "Restores 50 HP instantly when consumed.", price: 50, image: "assets/img/items/potion.png", effect: { hp: 50 }, consumable: true }
];

const weaponLevelsByCharacter = {
    warrior: swordLevels,
    wizard: staffLevels,
    slime: slimeLevels
};

function getCurrentWeaponLevel() {
    const levels = weaponLevelsByCharacter[playerData.character];

    if (!levels) {
        console.error("Unknown character type:", playerData.character);
        return swordLevels[0];
    }

    for (let i = levels.length - 1; i >= 0; i--) {
        if (playerData.inventory.includes(levels[i].name)) {
            return i + 1 < levels.length ? levels[i + 1] : levels[i];
        }
    }

    return levels[0];
}


function getCurrentArmorLevel() {
    for (let i = armorLevels.length - 1; i >= 0; i--) {
        if (playerData.inventory.includes(armorLevels[i].name)) {
            return i + 1 < armorLevels.length ? armorLevels[i + 1] : armorLevels[i];
        }
    }
    return armorLevels[0];
}

document.addEventListener('DOMContentLoaded', () => {
    playerData = JSON.parse(localStorage.getItem('player'));

    if (!playerData) {
        alert("No hero selected! Redirecting to hero selection.");
        window.location.href = "index.html";
        return;
    }

    document.getElementById("fightBtn").addEventListener("click", () => {
        if (!playerData.inventory || playerData.inventory.length === 0) {
            const itemModal = new bootstrap.Modal(document.getElementById('itemModal'));
            itemModal.show();
        } else {
            window.location.href = "game.html";
        }
    });
    document.getElementById("goToStoreBtn").addEventListener("click", () => {
        window.location.href = "character.html?#store";
    });
    document.getElementById("proceedBtn").addEventListener("click", () => {
        window.location.href = "game.html";
    });


    playerData.kills = playerData.kills || {
        slime: 0,
        wolf: 0,
        jessica: 0,
        dragon: 0
    };
    if (!Array.isArray(playerData.items) || playerData.items.length !== 4) {
        playerData.items = [null, null, null, null];
    }
    playerData.inventory = playerData.inventory || [];
    playerData.currentQuestIndex = playerData.currentQuestIndex ?? 0;

    const char = heroTales[playerData.character] || heroTales.warrior;

    document.getElementById('hero-img').src = char.img;
    document.getElementById('hero-img').alt = playerData.character;
    document.getElementById('hero-name').textContent = playerData.character.charAt(0).toUpperCase() + playerData.character.slice(1);
    updateStats();

    document.getElementById('tale-title').textContent = char.taleTitle;
    const taleBody = document.getElementById('tale-body');
    taleBody.innerHTML = '';
    char.taleText.forEach(paragraph => {
        const p = document.createElement('p');
        p.textContent = paragraph;
        taleBody.appendChild(p);
    });

    document.getElementById('tale-quote').textContent = char.quote;

    const currentQuest = questChain[playerData.currentQuestIndex];
    document.getElementById('current-quest').textContent = currentQuest
        ? getQuestText(currentQuest, playerData)
        : "All quests completed!";

    renderStore();
    renderItems();
    renderInventory();
    saveData();
});

function renderStore() {
    const storeContainer = document.getElementById('store-items');
    storeContainer.innerHTML = '';

    const currentWeapon = getCurrentWeaponLevel();
    const currentArmor = getCurrentArmorLevel();
    const storeItems = [currentWeapon, currentArmor, ...storeItemsBase];

    storeItems.forEach((item, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.innerHTML = `
            <div class="card h-100 bg-success bg-opacity-50 text-light shadow-sm">
                <img src="${item.image}" class="card-img-top p-3" alt="${item.name}" style="height: 180px; object-fit: contain;" />
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text flex-grow-1">${item.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="fw-bold text-warning"><i class="bi bi-coin"></i> ${item.price} Gold</span>
                        <button class="btn btn-warning btn-sm fw-bold buy-btn" data-index="${index}">Buy</button>
                    </div>
                </div>
            </div>
        `;
        storeContainer.appendChild(col);
    });
}

document.getElementById('store-items').addEventListener('click', function (e) {
    if (!e.target.classList.contains('buy-btn')) return;

    const index = parseInt(e.target.dataset.index);
    const currentWeapon = getCurrentWeaponLevel();
    const currentArmor = getCurrentArmorLevel();
    const storeItems = [currentWeapon, currentArmor, ...storeItemsBase];
    const item = storeItems[index];

    if (playerData.gold < item.price) {
        alert("Not enough gold!");
        return;
    }

    playerData.gold -= item.price;

    if (item.name.startsWith("Sword of Valor")) {
        swordLevels.forEach(sword => {
            const pos = playerData.inventory.indexOf(sword.name);
            if (pos !== -1) playerData.inventory.splice(pos, 1);
        });
    }

    playerData.inventory.push(item.name);
    updateStats();
    saveData();
    renderInventory();
    renderStore();
});

function renderItems() {
    const itemsContainer = document.getElementById('items');
    itemsContainer.innerHTML = '';

    for (let i = 0; i < playerData.items.length; i++) {
        const item = playerData.items[i];
        const col = document.createElement('div');
        col.className = 'col-4';

        if (item) {
            col.innerHTML = `
                <div class="border border-dark rounded d-flex flex-column align-items-center bg-warning p-1"
                    style="aspect-ratio: 1 / 1; cursor: pointer; max-width: 80px; max-height: 80px;" data-index="${i}">
                    <img src="${item.image}" alt="${item.name}" style="max-height: 40px; object-fit: contain;" />
                    <button class="btn btn-sm btn-danger unequip-btn p-0 mt-2" style="font-size: 0.6rem;">Unequip</button>
                </div>
            `;
        } else {
            col.innerHTML = `
                <div class="border border-dark rounded bg-warning"
                    style="aspect-ratio: 1 / 1; max-width: 80px; max-height: 80px;"></div>
            `;
        }

        itemsContainer.appendChild(col);
    }
}

function findItemDataByName(name) {
    return swordLevels.find(i => i.name === name) ||
        armorLevels.find(i => i.name === name) ||
        storeItemsBase.find(i => i.name === name) ||
        null;
}

function renderInventory() {
    const inventoryContainer = document.getElementById('inventory');
    inventoryContainer.innerHTML = '';

    playerData.inventory.forEach((itemName, index) => {
        const item = findItemDataByName(itemName);
        if (!item) return;

        const col = document.createElement('div');
        col.className = 'col-4 d-flex justify-content-center';
        col.innerHTML = `
            <div class="d-flex flex-column align-items-center p-1"
                style="aspect-ratio: 1 / 1; max-width: 80px; max-height: 80px; cursor: pointer;" data-index="${index}">
                <img src="${item.image}" alt="${item.name}" style="max-height: 40px; object-fit: contain;" />
                <small class="text-light text-center" style="font-size: 0.6rem;">${item.name}</small>
                ${item.consumable
                ? '<button class="btn btn-sm btn-success mt-1 p-0 use-btn" style="font-size: 0.6rem;">Use</button>'
                : '<button class="btn btn-sm btn-primary mt-1 p-0 equip-btn" style="font-size: 0.6rem;">Equip</button>'}
            </div>
        `;
        inventoryContainer.appendChild(col);
    });
}

document.getElementById('inventory').addEventListener('click', (e) => {
    const btn = e.target;
    const parent = btn.closest('[data-index]');
    if (!parent) return;
    const index = parseInt(parent.dataset.index);
    const itemName = playerData.inventory[index];
    const item = findItemDataByName(itemName);
    if (!item) return;

    if (btn.classList.contains('equip-btn')) {
        const slot = playerData.items.findIndex(i => i === null);
        if (slot === -1) return alert("No empty slot to equip.");
        applyItemEffect(item);
        playerData.items[slot] = item;
        playerData.inventory.splice(index, 1);
    } else if (btn.classList.contains('use-btn')) {
        if (item.effect.hp) {
            playerData.hp = Math.min(playerData.hp + item.effect.hp, 100); // Assuming max HP is 100
        }
        playerData.inventory.splice(index, 1);
    }

    updateStats();
    saveData();
    renderItems();
    renderInventory();
});

document.getElementById('items').addEventListener('click', (e) => {
    const btn = e.target;
    const parent = btn.closest('[data-index]');
    if (!parent) return;
    const index = parseInt(parent.dataset.index);
    const item = playerData.items[index];
    if (!item || !btn.classList.contains('unequip-btn')) return;

    removeItemEffect(item);
    playerData.inventory.push(item.name);
    playerData.items[index] = null;

    updateStats();
    saveData();
    renderItems();
    renderInventory();
});

function applyItemEffect(item) {
    if (item.effect.attack) playerData.attack += item.effect.attack;
    if (item.effect.defense) playerData.defense += item.effect.defense;
    if (item.effect.speed) playerData.speed += item.effect.speed;
}

function removeItemEffect(item) {
    if (item.effect.attack) playerData.attack -= item.effect.attack;
    if (item.effect.defense) playerData.defense -= item.effect.defense;
    if (item.effect.speed) playerData.speed -= item.effect.speed;
}

function updateStats() {
    document.getElementById('hero-hp').textContent = playerData.hp;
    document.getElementById('hero-attack').textContent = playerData.attack;
    document.getElementById('hero-defense').textContent = playerData.defense;
    document.getElementById('hero-speed').textContent = playerData.speed;
    document.getElementById('hero-gold').textContent = playerData.gold;
}

function saveData() {
    localStorage.setItem('player', JSON.stringify(playerData));
}
