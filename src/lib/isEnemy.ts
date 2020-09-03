import { BTSnake } from '../types/BTData';

export function isEnemy(you: BTSnake, other: BTSnake) {
    if (you.id == other.id || (you.squad && you.squad == other.squad)) {
        return false;
    }
    return true;
}

export function isSquad(you: BTSnake, other: BTSnake) {
    if (you.id == other.id) {
        return false;
    }
    if (you.squad && you.squad == other.squad) {
        return true;
    }
    return false;
}
