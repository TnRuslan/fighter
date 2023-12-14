import controls from '../../constants/controls';

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        let winner = null;
        let firstFighterBlocked = false;
        let secondFighterBlocked = false;

        function handleKeyDown(e) {
            if (e.code === controls.PlayerOneAttack && !firstFighterBlocked) {
                const damage = getDamage(firstFighter, secondFighter);
                secondFighter.health -= damage;
                if (secondFighter.health <= 0) {
                    winner = firstFighter;
                    window.removeEventListener('keydown', handleKeyDown);
                    resolve(winner);
                }
            } else if (e.code === controls.PlayerTwoAttack && !secondFighterBlocked) {
                const damage = getDamage(secondFighter, firstFighter);
                firstFighter.health -= damage;
                if (firstFighter.health <= 0) {
                    winner = secondFighter;
                    window.removeEventListener('keydown', handleKeyDown);
                    resolve(winner);
                }
            } else if (e.code === controls.PlayerOneBlock) {
                firstFighterBlocked = true;
                setTimeout(() => {
                    firstFighterBlocked = false;
                }, 1000); // Assuming 1 second block duration
            } else if (e.code === controls.PlayerTwoBlock) {
                secondFighterBlocked = true;
                setTimeout(() => {
                    secondFighterBlocked = false;
                }, 1000); // Assuming 1 second block duration
            }
        }

        window.addEventListener('keydown', handleKeyDown);
    });
}

export function getDamage(attacker, defender) {
    const damage = getHitPower(attacker) - getBlockPower(defender);
    return damage > 0 ? damage : 0;
}

export function getHitPower(fighter) {
    const { attack } = fighter;
    const minCriticalChance = 1;
    const maxCriticalChance = 2;

    const criticalHitChance = getRandomNumber(minCriticalChance, maxCriticalChance);
    const hitPower = attack * criticalHitChance;

    return hitPower;
}

export function getBlockPower(fighter) {
    const { defense } = fighter;
    const minDodgeChance = 1;
    const maxDodgeChance = 2;

    const dodgeChance = getRandomNumber(minDodgeChance, maxDodgeChance);
    const blockPower = defense * dodgeChance;

    return blockPower;
}
