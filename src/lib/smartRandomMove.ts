import { isFree } from './isFree';
import { log } from './log';
import { BTData } from '../types/BTData';
import { MoveDirection } from '../types/MoveDirection';
import { shuffle } from './shuffle';
import { weight } from './weight';

export function smartRandomMove(data: BTData) {
    let x, y, w;
    let directions = [
        {
            direction: MoveDirection.LEFT,
            weight: null,
        },
        {
            direction: MoveDirection.RIGHT,
            weight: null,
        },
        {
            direction: MoveDirection.UP,
            weight: null,
        },
        {
            direction: MoveDirection.DOWN,
            weight: null,
        },
    ];

    for (const d of directions) {
        switch (d.direction) {
            case MoveDirection.UP:
                x = data.you.body[0].x;
                y = data.you.body[0].y - 1;
                break;

            case MoveDirection.DOWN:
                x = data.you.body[0].x;
                y = data.you.body[0].y + 1;
                break;

            case MoveDirection.LEFT:
                x = data.you.body[0].x - 1;
                y = data.you.body[0].y;
                break;

            case MoveDirection.RIGHT:
                x = data.you.body[0].x + 1;
                y = data.you.body[0].y;
                break;
        }

        if (isFree(data, x, y)) {
            d.weight = weight(data, x, y);
        }
    }
    directions = directions
        .filter(d => d.weight > 0)
        .sort((a, b) => b.weight - a.weight);
    if (!directions.length) {
        log('smartRandomMove', 'no-options');
        return;
    }
    const bestWeight = directions[0].weight;
    directions = directions.filter(d => d.weight == bestWeight);
    shuffle(directions);
    log('smartRandomMove', directions);
    return directions[0].direction;
}
