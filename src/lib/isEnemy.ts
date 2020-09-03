import { BTSnake } from '../types/BTData';

export function isEnemy(you: BTSnake, other: BTSnake) {
    if (other.id == you.id || (you.squad && you.squad == other.squad)) {
        return false;
    }
    return true;
}
