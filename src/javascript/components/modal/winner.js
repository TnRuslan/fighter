import showModal from './modal';
import { createFighter } from '../arena';

export default function showWinnerModal(fighter) {
    const winnerElement = createFighter(fighter);
    const winner = {
        title: `WINNER ${fighter.name}`,
        bodyElement: winnerElement
    };

    showModal(winner);
    // call showModal function
}
