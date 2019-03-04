import { isFree } from './isFree';
import { log } from './log';
import { BTData, BTSnake } from '../types/BTData';
import { MoveDirection } from '../types/MoveDirection';
import { shuffle } from './shuffle';
import { gridDistance } from './gridDistance';
import { Pather } from './Pather';

const closestBlocked = (data: BTData, sx: number, sy: number) => {
    let distance;
    let closest = 10000;
    for (const snake of data.board.snakes) {
        for (const part of snake.body) {
            distance = gridDistance(sx, sy, part.x, part.y);
            if (distance < closest) {
                closest = distance;
            }
        }
    }
    for (let x = 0; x < data.board.width; x++) {
        distance = gridDistance(sx, sy, x, -1);
        if (distance < closest) {
            closest = distance;
        }
        distance = gridDistance(sx, sy, x, data.board.height + 1);
        if (distance < closest) {
            closest = distance;
        }
    }
    for (let y = 0; y < data.board.height; y++) {
        distance = gridDistance(sx, sy, -1, y);
        if (distance < closest) {
            closest = distance;
        }
        distance = gridDistance(sx, sy, data.board.width + 1, y);
        if (distance < closest) {
            closest = distance;
        }
    }
    return closest;
};

export function moveAway(data: BTData, minDistance = null) {
    const furthestAway = {
        x: null,
        y: null,
        distance: null,
        pathDirection: null,
    };
    let pather = new Pather(data);
    const grid = [];
    for (let y = 0; y < data.board.height; y++) {
        const row = [];
        for (let x = 0; x < data.board.width; x++) {
            row[x] = closestBlocked(data, x, y);
            if (furthestAway.distance === null || row[x] > furthestAway.distance) {
                const pathDirection = pather.pathDirection(x, y);
                if (pathDirection) {
                    furthestAway.x = x;
                    furthestAway.y = y;
                    furthestAway.distance = row[x];
                    furthestAway.pathDirection = pathDirection;
                }
            }
        }
        grid[y] = row;
    }

    if (minDistance !== null) {
        pather = new Pather(data, false);
        for (const snake of data.board.snakes) {
            if (snake.id == data.you.id) {
                continue;
            }
            const path = pather.pathTo(snake.body[0].x, snake.body[0].y);
            if (path.length && path.length <= minDistance) {
                log('moveAway', 'minDistance', furthestAway);
                return furthestAway.pathDirection;
            }
        }
        log('moveAway', 'minDistance', 'no need');
        return;
    }

    if (furthestAway) {
        log('moveAway', furthestAway);
        return furthestAway.pathDirection;
    }
    log('moveAway', 'no options');
}
