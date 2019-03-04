import { log } from './log';
import { BTData } from '../types/BTData';
import { sortedFood } from './sortedFood';
import { Pather } from './Pather';
import { weight } from './weight';

export function moveTowardsFoodPf(data: BTData) {
    let pather = new Pather(data);

    const sorted = sortedFood(data);
    if (!sorted.length) {
        log('moveTowardsFoodPf', 'no food');
        return;
    }
    for (const closest of sorted) {
        const direction = pather.pathDirection(closest.food.x, closest.food.y);
        if (direction && weight(data, closest.food.x, closest.food.y) > data.you.body.length) {
            log('moveTowardsFoodPf', direction);
            return direction;
        }
    }
    log('moveTowardsFoodPf', 'no options');
}
