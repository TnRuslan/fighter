import controls from '../../constants/controls';

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const playerOneCombo = new Set();
const playerTwoCombo = new Set();

const COMBO_DELAY = 10000;
const BLOCK_DELAY = 1000;

export function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        let firstFighterBlocked = false;
        let secondFighterBlocked = false;

        let canPlayerOneUseCombo = true;
        let canPlayerTwoUseCombo = true;

        let { health: firstFighterHealth } = firstFighter;
        let { health: secondFighterHealth } = secondFighter;

        const { PlayerOneAttack, PlayerTwoAttack, PlayerOneBlock, PlayerTwoBlock } = controls;

        const firstFighterHealthBar = document.getElementById('left-fighter-indicator');
        const secondFighterHealthBar = document.getElementById('right-fighter-indicator');

        const { offsetWidth: firstFighterWithBarWidth } = firstFighterHealthBar;
        const { offsetWidth: secondFighterWithBarWidth } = secondFighterHealthBar;

        function handleKeyDown(e) {
            const { code } = e;

            if (playerOneCombo.size === 3) {
                secondFighterHealth -= getHitPower(firstFighter) * 2;
                playerOneCombo.clear();

                canPlayerOneUseCombo = false;

                secondFighterHealthBar.style.width = `${
                    (secondFighterWithBarWidth * secondFighterHealth) / secondFighter.health
                }px`;

                if (secondFighterHealth <= 0) {
                    window.removeEventListener('keydown', handleKeyDown);
                    resolve(firstFighter);
                }

                setTimeout(() => {
                    canPlayerOneUseCombo = true;
                }, COMBO_DELAY);
            }

            if (playerTwoCombo.size === 3) {
                firstFighterHealth -= getHitPower(secondFighter) * 2;
                playerTwoCombo.clear();

                firstFighterHealthBar.style.width = `${
                    (firstFighterWithBarWidth * firstFighterHealth) / firstFighter.health
                }px`;

                if (firstFighterHealth <= 0) {
                    window.removeEventListener('keydown', handleKeyDown);
                    resolve(secondFighter);
                }

                setTimeout(() => {
                    canPlayerTwoUseCombo = true;
                }, COMBO_DELAY);
            }

            if (code === PlayerOneAttack && !firstFighterBlocked) {
                secondFighterHealth -= secondFighterBlocked
                    ? getDamage(firstFighter, secondFighter)
                    : getHitPower(firstFighter);

                secondFighterHealthBar.style.width = `${
                    (secondFighterWithBarWidth * secondFighterHealth) / secondFighter.health
                }px`;

                if (secondFighterHealth <= 0) {
                    window.removeEventListener('keydown', handleKeyDown);
                    resolve(firstFighter);
                }
            } else if (code === PlayerTwoAttack && !secondFighterBlocked) {
                firstFighterHealth -= firstFighterBlocked
                    ? getDamage(secondFighter, firstFighter)
                    : getHitPower(secondFighter);

                firstFighterHealthBar.style.width = `${
                    (firstFighterWithBarWidth * firstFighterHealth) / firstFighter.health
                }px`;

                if (firstFighterHealth <= 0) {
                    window.removeEventListener('keydown', handleKeyDown);
                    resolve(secondFighter);
                }
            } else if (code === PlayerOneBlock) {
                firstFighterBlocked = true;

                setTimeout(() => {
                    firstFighterBlocked = false;
                }, BLOCK_DELAY);
            } else if (code === PlayerTwoBlock) {
                secondFighterBlocked = true;

                setTimeout(() => {
                    secondFighterBlocked = false;
                }, BLOCK_DELAY);
            }
        }

        window.addEventListener('keydown', e => {
            const { code } = e;

            if (controls.PlayerOneCriticalHitCombination.includes(code) && canPlayerOneUseCombo) {
                playerOneCombo.add(code, true);
                return;
            }

            if (controls.PlayerTwoCriticalHitCombination.includes(code) && canPlayerTwoUseCombo) {
                playerTwoCombo.add(code, true);
                return;
            }

            playerOneCombo.clear;
            playerTwoCombo.clear;
        });

        window.addEventListener('keydown', handleKeyDown);
    });
}

export function getDamage(attacker, defender) {
    const damage = getHitPower(attacker) - getBlockPower(defender);
    return damage > 0 ? damage : 0;
    // return damage
}

export function getHitPower(fighter) {
    const { attack } = fighter;
    const minCriticalChance = 1;
    const maxCriticalChance = 2;

    const criticalHitChance = getRandomNumber(minCriticalChance, maxCriticalChance);
    const hitPover = attack * criticalHitChance;

    return hitPover;
    // return hit power
}

export function getBlockPower(fighter) {
    const { defense } = fighter;
    const minDodgeChance = 1;
    const maxDodgeChance = 2;

    const criticalHitChance = getRandomNumber(minDodgeChance, maxDodgeChance);
    const hitPover = defense * criticalHitChance;

    return hitPover;
    // return block power
}
