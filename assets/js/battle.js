document.addEventListener('DOMContentLoaded', () => {
    let selectedSkill = null;
    const playerData = JSON.parse(localStorage.getItem('player')) || {};

    // === Validate essential player data ===
    if (!playerData.skills) {
        alert("Skills not found! Go back and choose your hero first.");
        window.location.href = "character.html";
        return;
    }

    playerData.attack = playerData.attack ?? 15;
    playerData.defense = playerData.defense ?? 15;
    playerData.hp = playerData.hp ?? 100;
    playerData.maxHp = playerData.maxHp ?? 100;
    playerData.gold = playerData.gold ?? 250;


    // === Set hero image ===
    if (playerData.character) {
        const heroImages = {
            warrior: 'assets/img/warrior.gif',
            wizard: 'assets/img/wizard.gif',
            slime: 'assets/img/slime.gif'
        };
        const heroImgSrc = heroImages[playerData.character] || heroImages.warrior;
        const heroImgEl = document.querySelector('.hero-img');
        if (heroImgEl) {
            heroImgEl.src = heroImgSrc;
            heroImgEl.alt = playerData.character;
        }
    }

    // === Define enemies ===
    const enemies = {
        slime: { name: "Slime", img: "assets/img/slime.gif", hp: 100, gold: 25, attack: 15, defense: 10 },
        wolf: { name: "Wolf", img: "assets/img/wolf.gif", hp: 150, gold: 80, attack: 25, defense: 20 },
        jessica: { name: "Jessica", img: "assets/img/jessica.gif", hp: 200, gold: 120, attack: 40, defense: 40 },
        dragon: { name: "Dragon", img: "assets/img/dragon.gif", hp: 300, gold: 300, attack: 60, defense: 80 }
    };

    // === Initialize kills and quest progress ===
    playerData.kills = playerData.kills || {
        slime: 0, wolf: 0, jessica: 0, dragon: 0
    };

    const questChain = [
        { key: 'slime', target: 3, description: 'Defeat Slimes', reward: 75 },
        { key: 'wolf', target: 5, description: 'Defeat Wolves', reward: 120 },
        { key: 'jessica', target: 1, description: 'Defeat Jessica', reward: 180 },
        { key: 'dragon', target: 1, description: 'Defeat Dragon', reward: 500 }
    ];

    playerData.currentQuestIndex = playerData.currentQuestIndex ?? 0;

    // === Load enemy from URL ===
    const params = new URLSearchParams(window.location.search);
    const enemyKey = params.get("enemy") || "slime";
    const enemy = enemies[enemyKey];

    if (!enemy) {
        alert("Unknown enemy!");
        window.location.href = "game.html";
        return;
    }

    // === Set enemy info ===
    document.getElementById("enemy-name").innerText = enemy.name;
    document.getElementById("enemy-img").src = enemy.img;

    // === Initialize HP ===
    let heroHP = playerData.hp;
    let maxHeroHP = playerData.maxHp;
    let enemyHP = enemy.hp;

    const heroBar = document.getElementById("hero-hp");
    const enemyBar = document.getElementById("enemy-hp");

    function updateHPBars(heroDamage = 0, enemyDamage = 0) {
        heroBar.style.width = `${(heroHP / maxHeroHP) * 100}%`;
        enemyBar.style.width = `${(enemyHP / enemy.hp) * 100}%`;

        const heroText = document.getElementById('hero-hp-text');
        const enemyText = document.getElementById('enemy-hp-text');

        heroText.innerHTML = `${heroHP} HP`;
        enemyText.innerHTML = `${enemyHP} HP`;

        if (heroDamage > 0) {
            const dmg = document.createElement('span');
            dmg.className = 'damage-badge damage-hero';
            dmg.textContent = `-${heroDamage}`;
            heroText.appendChild(dmg);

            setTimeout(() => dmg.remove(), 1200);
        }

        if (enemyDamage > 0) {
            const dmg = document.createElement('span');
            dmg.className = 'damage-badge damage-enemy';
            dmg.textContent = `-${enemyDamage}`;
            enemyText.appendChild(dmg);

            setTimeout(() => dmg.remove(), 1200);
        }
    }

    updateHPBars();

    const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
    const resultModalBody = document.getElementById('resultModalBody');
    const resultModalBtn = document.getElementById('resultModalBtn');

    function calculateDamage(basePower, attackerStat, defenderStat) {
        const baseDamage = basePower + attackerStat - defenderStat;
        const min = Math.floor(baseDamage * 0.8);
        const max = Math.ceil(baseDamage * 1.2);
        const finalDamage = Math.floor(Math.random() * (max - min + 1)) + min;
        return Math.max(1, finalDamage);
    }

    function enemyAttack() {
        const baseEnemyDamage = Math.floor(Math.random() * 10) + 10; // Randomness
        return calculateDamage(baseEnemyDamage, enemy.attack, playerData.defense);
    }

    function advanceQuestIfNeeded() {
        const currentQuest = questChain[playerData.currentQuestIndex];
        if (!currentQuest) return;
        const kills = playerData.kills[currentQuest.key] || 0;
        if (kills >= currentQuest.target) {
            playerData.gold += currentQuest.reward;
            playerData.currentQuestIndex++;
            alert(`Quest complete: ${currentQuest.description}! You earned ${currentQuest.reward} gold!`);
        }
    }

    function checkBattleOutcome(lastSkillName, damageDealt) {
        const resetStatsIfBuffed = () => {
            if (playerData._originalStats) {
                const original = playerData._originalStats;
                for (const key in original) {
                    playerData[key] = original[key];
                }
                delete playerData._originalStats;
            }
        };

        if (heroHP === 0 && enemyHP === 0) {
            playerData.kills[enemyKey] = (playerData.kills[enemyKey] || 0) + 1;
            playerData.gold += enemy.gold;
            playerData.hp = playerData.maxHp

            resetStatsIfBuffed();
            advanceQuestIfNeeded();
            localStorage.setItem('player', JSON.stringify(playerData));

            resultModalBody.textContent = `${lastSkillName} defeated the ${enemy.name}! You earned ${enemy.gold} gold.`;
            resultModal.show();
            resultModalBtn.onclick = () => {
                resultModal.hide();
                window.location.href = "game.html";
            };
        } else if (enemyHP === 0) {
            playerData.kills[enemyKey] = (playerData.kills[enemyKey] || 0) + 1;
            playerData.gold += enemy.gold;
            playerData.hp = heroHP;

            resetStatsIfBuffed();
            advanceQuestIfNeeded();
            localStorage.setItem('player', JSON.stringify(playerData));

            resultModalBody.textContent = `${lastSkillName} defeated the ${enemy.name}! You earned ${enemy.gold} gold.`;
            resultModal.show();
            resultModalBtn.onclick = () => {
                resultModal.hide();
                window.location.href = "game.html";
            };
        } else if (heroHP === 0) {
            const heroImg = document.querySelector('.hero-img');
            heroImg.classList.add('die-animation');

            playerData.hp = playerData.maxHp;
            resetStatsIfBuffed();
            localStorage.setItem('player', JSON.stringify(playerData));

            resultModalBody.textContent = `You were defeated by the ${enemy.name}...`;
            resultModal.show();
            resultModalBtn.onclick = () => {
                resultModal.hide();
                window.location.href = "game.html";
            };
        } else {
            playerData.hp = heroHP;
            resetStatsIfBuffed();
            localStorage.setItem('player', JSON.stringify(playerData));
        }
    }

    function performHeroAttack(skill) {
        const heroImg = document.querySelector('.hero-img');
        const enemyImg = document.getElementById('enemy-img');

        // Hero attack animation
        heroImg.classList.add('attack-animation');

        heroImg.addEventListener('animationend', () => {
            heroImg.classList.remove('attack-animation');

            // Enemy gets hit
            enemyImg.classList.add('enemy-hit');
            setTimeout(() => enemyImg.classList.remove('enemy-hit'), 300);

            // Calculate and apply damage
            const damage = calculateDamage(skill.power, playerData.attack, enemy.defense);
            enemyHP = Math.max(0, enemyHP - damage);
            updateHPBars(0, damage);
            checkBattleOutcome(skill.name, damage);

            // Enemy turn
            if (enemyHP > 0) {
                setTimeout(() => {
                    // Monster attack animation
                    enemyImg.classList.add('monster-attack');
                    enemyImg.addEventListener('animationend', () => {
                        enemyImg.classList.remove('monster-attack');

                        // Hero gets hit
                        heroImg.classList.add('hero-hit');
                        setTimeout(() => heroImg.classList.remove('hero-hit'), 300);

                        const retaliation = enemyAttack();
                        heroHP = Math.max(0, heroHP - retaliation);
                        updateHPBars(retaliation, 0);
                        checkBattleOutcome(skill.name, damage);
                    }, { once: true });
                }, 600);
            }

        }, { once: true });
    }




    function applyBuffSkill(buff) {
        if (!playerData._originalStats) {
            playerData._originalStats = { ...playerData };
        }

        // Apply buff
        playerData[buff.stat] += buff.value;
        alert(`${buff.name} activated! Your ${buff.stat} increased by ${buff.value}.`);

        // Enemy retaliates
        const retaliation = enemyAttack();
        heroHP = Math.max(0, heroHP - retaliation);
        updateHPBars(retaliation, 0);
        checkBattleOutcome(buff.name, 0); // No damage dealt by buff
    }

    // === Skill cooldown management ===
    const skillCooldowns = {
        basic: 0,
        attackSkill: 0,
        buffSkill: 0
    };

    // Utility to update buttons disabled state and show cooldown
    function updateCooldownUI() {
        function updateButton(id, cooldown, skillName) {
            const btn = document.getElementById(id);
            if (cooldown > 0) {
                btn.disabled = true;
                btn.textContent = `${skillName} (${cooldown})`;
                btn.classList.remove("btn-warning");
                btn.classList.add("btn-secondary");
            } else {
                btn.disabled = false;
                btn.textContent = skillName;
                btn.classList.remove("btn-secondary");
                btn.classList.add("btn-warning");
            }
        }

        updateButton("btn-basic", skillCooldowns.basic, playerData.skills.basic.name);
        updateButton("btn-attack", skillCooldowns.attackSkill, playerData.skills.attackSkill.name);
        updateButton("btn-buff-skill", skillCooldowns.buffSkill, playerData.skills.buffSkill.name);
        document.getElementById("btn-run").textContent = "Run";
    }

    // Initialize buttons
    updateCooldownUI();

    // Clear skill highlight
    function clearSkillHighlight() {
        ["btn-basic", "btn-attack", "btn-buff-skill"].forEach(id => {
            document.getElementById(id).classList.remove("selected");
        });
    }

    function highlightSelectedSkill(buttonId) {
        clearSkillHighlight();
        document.getElementById(buttonId).classList.add("selected");
    }

    // === Button handlers with cooldown check ===
    document.getElementById("btn-basic").addEventListener("click", () => {
        if (skillCooldowns.basic === 0) {
            selectedSkill = playerData.skills.basic;
            highlightSelectedSkill("btn-basic");
        } else {
            alert(`Basic skill is on cooldown for ${skillCooldowns.basic} turn(s).`);
        }
    });

    document.getElementById("btn-attack").addEventListener("click", () => {
        if (skillCooldowns.attackSkill === 0) {
            selectedSkill = playerData.skills.attackSkill;
            highlightSelectedSkill("btn-attack");
        } else {
            alert(`Attack skill is on cooldown for ${skillCooldowns.attackSkill} turn(s).`);
        }
    });

    document.getElementById("btn-buff-skill").addEventListener("click", () => {
        if (skillCooldowns.buffSkill === 0) {
            selectedSkill = playerData.skills.buffSkill;
            highlightSelectedSkill("btn-buff-skill");
        } else {
            alert(`Buff skill is on cooldown for ${skillCooldowns.buffSkill} turn(s).`);
        }
    });

    document.getElementById("btn-run").addEventListener("click", () => {
        window.location.href = "game.html";
    });

    document.getElementById("attackBtn").addEventListener("click", () => {
        if (!selectedSkill) {
            alert("Please select a skill first!");
            return;
        }

        // Double-check cooldown before executing skill
        const keyMap = {
            [playerData.skills.basic.name]: "basic",
            [playerData.skills.attackSkill.name]: "attackSkill",
            [playerData.skills.buffSkill.name]: "buffSkill"
        };
        const skillKey = keyMap[selectedSkill.name];

        if (skillCooldowns[skillKey] > 0) {
            alert(`${selectedSkill.name} is on cooldown for ${skillCooldowns[skillKey]} more turn(s).`);
            return;
        }

        // Use skill
        if (selectedSkill.type === "buff") {
            applyBuffSkill(selectedSkill);
        } else {
            performHeroAttack(selectedSkill);
        }

        // Set cooldown for used skill
        if (skillKey === "attackSkill") {
            skillCooldowns.attackSkill = 3;  // example: 3 turn cooldown
        } else if (skillKey === "buffSkill") {
            skillCooldowns.buffSkill = 2;    // example: 2 turn cooldown
        } else if (skillKey === "basic") {
            skillCooldowns.basic = 0;        // no cooldown for basic skill
        }

        // Decrement cooldowns for other skills (except the one just used)
        for (const key in skillCooldowns) {
            if (key !== skillKey && skillCooldowns[key] > 0) {
                skillCooldowns[key]--;
            }
        }

        updateCooldownUI();
        selectedSkill = null;
        clearSkillHighlight();
    });

});
