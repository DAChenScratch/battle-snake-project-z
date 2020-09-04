import { isFree } from './isFree';
import { log } from './log';
import { BTData, BTSnake, BTRequest } from '../types/BTData';
import { MoveDirection } from '../types/MoveDirection';
import { shuffle } from './shuffle';
import { gridDistance } from './gridDistance';
import { Pather } from './Pather';

const closestBlocked = (request: BTRequest, sx: number, sy: number) => {
    let distance;
    let closest = 10000;
    for (const snake of request.body.board.snakes) {
        for (const part of snake.body) {
            distance = gridDistance(sx, sy, part.x, part.y);
            if (distance < closest) {
                closest = distance;
            }
        }
    }
    for (let x = 0; x < request.body.board.width; x++) {
        distance = gridDistance(sx, sy, x, -1);
        if (distance < closest) {
            closest = distance;
        }
        distance = gridDistance(sx, sy, x, request.body.board.height + 1);
        if (distance < closest) {
            closest = distance;
        }
    }
    for (let y = 0; y < request.body.board.height; y++) {
        distance = gridDistance(sx, sy, -1, y);
        if (distance < closest) {
            closest = distance;
        }
        distance = gridDistance(sx, sy, request.body.board.width + 1, y);
        if (distance < closest) {
            closest = distance;
        }
    }
    return closest;
};

export function moveAway(request: BTRequest, minDistance = null) {
    const furthestAway = {
        x: null,
        y: null,
        distance: null,
        pathDirection: null,
    };
    let pather = new Pather(request);
    const grid = [];
    for (let y = 0; y < request.body.board.height; y++) {
        const row = [];
        for (let x = 0; x < request.body.board.width; x++) {
            row[x] = closestBlocked(request, x, y);
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
        pather = new Pather(request, false);
        for (const snake of request.body.board.snakes) {
            if (snake.id == request.body.you.id) {
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
