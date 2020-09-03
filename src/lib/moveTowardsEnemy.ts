import { log } from './log';
import { BTData } from '../types/BTData';
import { closestEnemyHead } from './closestEnemyHead';

export function moveTowardsEnemy(data: BTData) {
    const closest = closestEnemyHead(data);
    if (closest.direction) {
        log('moveTowardsEnemy', closest.direction);
        return closest.direction;
    }
    log('moveTowardsEnemy', 'no options');
}
