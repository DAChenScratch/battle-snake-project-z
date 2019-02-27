import { shuffle } from './shuffle';
import { gridDistance } from './gridDistance';
import { isFree } from './isFree';
import { log } from './log';
import { BTData, BTXY } from '../types/BTData';
import { closestFood } from './closestFood';

interface Closest {
    food: BTXY,
    distance: number,
}

export function moveTowardsFood(data: BTData) {
    const closest = closestFood(data);
    if (!closest) {
        log('moveTowardsFood', 'no food');
        return;
    }

    let x, y;
    const directions = [0, 1, 2, 3];
    shuffle(directions);
    while (directions.length > 0) {
        const direction = directions.pop();
        switch (direction) {
            // Up
            case 0:
                x = data.you.body[0].x;
                y = data.you.body[0].y - 1;
                break;

            // Down
            case 1:
                x = data.you.body[0].x;
                y = data.you.body[0].y + 1;
                break;

            // Left
            case 2:
                x = data.you.body[0].x - 1;
                y = data.you.body[0].y;
                break;

            // Right
            case 3:
                x = data.you.body[0].x + 1;
                y = data.you.body[0].y;
                break;
        }
        if (isFree(data, x, y) && gridDistance(x, y, closest.food.x, closest.food.y) < closest.distance) {
            log('moveTowardsFood', direction, data.you.body[0].x, data.you.body[0].y, closest);
            return direction;
        }
    }
    log('moveTowardsFood', 'no options');
}
