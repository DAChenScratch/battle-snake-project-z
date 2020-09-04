import { log } from './log';
import { BTRequest } from '../types/BTData';
import { closestEnemyHead } from './closestEnemyHead';

export function moveTowardsEnemy(request: BTRequest) {
    const closest = closestEnemyHead(request);
    if (closest && closest.direction) {
        log('moveTowardsEnemy', closest.direction);
        return closest.direction;
    }
    log('moveTowardsEnemy', 'no options');
}
