function chooseHero(heroType) {
    const heroClasses = {
        paladdin: {
            stats: {hp: 100, maxHp: 100, attack: 15, defense: 20, speed: 10},
            skills: {
                attackSkill: {name: "Sword Slash", type: "attack", power: 20, cooldown: 3},
                buffSkill: {name: "Fortify Armor", type: "buff", stat: "defense", value: 3, cooldown: 2},
            }
        },
        wizard: {
            stats: {hp: 100, maxHp: 100, attack: 15, defense: 20, speed: 10},
            skills: {
                attackSkill: {name: "Sword Slash", type: "attack", power: 20, cooldown: 3},
                buffSkill: {name: "Fortify Armor", type: "buff", stat: "defense", value: 3, cooldown: 2},
            }
        }
    }
}

