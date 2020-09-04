import { gridDistance } from './gridDistance';
import { BTData } from '../types/BTData';
import { isFree } from './isFree';
import { cache } from './cache';
import { isEnemy, isSquad } from './isEnemy';

export const BLOCKED_THRESHOLD = 10;

export function floodFill(data: BTData, x: number, y: number) {
    const c = cache(data, 'floodFill', {});
    const key = x + ':' + y;
    if (!c[key]) {
        c[key] = floodFillCache(data, x, y);
    }
    return c[key];
}

export function floodFillCache(data: BTData, x: number, y: number) {
    let count = 0;
    const nodes = [];
    nodes.push({
        x,
        y,
    });
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (isFree(data, node.x, node.y)) {
            count++;
            if (!nodes.find(n => n.x == node.x + 1 && n.y == node.y)) {
                nodes.push({
                    x: node.x + 1,
                    y: node.y,
                });
            }
            if (!nodes.find(n => n.x == node.x - 1 && n.y == node.y)) {
                nodes.push({
                    x: node.x - 1,
                    y: node.y,
                });
            }
            if (!nodes.find(n => n.x == node.x && n.y == node.y + 1)) {
                nodes.push({
                    x: node.x,
                    y: node.y + 1,
                });
            }
            if (!nodes.find(n => n.x == node.x && n.y == node.y - 1)) {
                nodes.push({
                    x: node.x,
                    y: node.y - 1,
                });
            }
        }
    }
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const key = node.x + ':' + node.y;
        data.cache.floodFill[key] = count;
    }
    return count;
};

const isDeadEnd = (data: BTData, x: number, y: number) => {
    if (!isFree(data, x - 1, y) && !isFree(data, x + 1, y) && !isFree(data, x, y - 1) && !isFree(data, x, y + 1)) {
        return true;
    }
    return false;
};

const isOwnTail = (data: BTData, x: number, y: number) => {
    const part = data.you.body[data.you.body.length - 1];
    if (x == part.x && y == part.y) {
        return true;
    }
    return false;
};

const isNearTail = (data: BTData, x: number, y: number) => {
    for (const snake of data.board.snakes) {
        const body = snake.body;
        const part = body[body.length - 1];
        if (x == part.x && y == part.y) {
            return true;
        }
        if (x + 1 == part.x && y == part.y) {
            return true;
        }
        if (x - 1 == part.x && y == part.y) {
            return true;
        }
        if (x == part.x && y + 1 == part.y) {
            return true;
        }
        if (x == part.x && y - 1 == part.y) {
            return true;
        }
    }
    return false;
};

export function weight(data: BTData, x: number, y: number, blockHeads = true) {
    if (data.grid[y][x].weight === undefined) {
        data.grid[y][x].weight = computeWeight(data, x, y, blockHeads);
        let color = Math.round((data.grid[y][x].weight) / 100 * 255);
        data.grid[y][x].color = `rgba(${color}, ${color}, ${color}, 1)`;
    }
    return data.grid[y][x].weight;
}

function computeWeight(data: BTData, x: number, y: number, blockHeads = true) {
    if (data.board.hazards) {
        for (const hazard of data.board.hazards) {
            if (hazard.x == x && hazard.y == y) {
                return 5;
            }
        }
    }

    let result = 100;
    for (const snake of data.board.snakes) {
        const body = snake.body;
        // const body = snake.body.filter((p1, i, a) => a.findIndex(p2 => p1.x == p2.x && p1.y == p2.y) === i);
        for (const [p, part] of body.entries()) {
            // Is part of snake?
            if (part.x == x && part.y == y) {
                // Is end of snake?
                if (p != body.length - 1) {
                    // Is head of snake, and head blocking?
                    if (p === 0 && !blockHeads) {
                        continue;
                    }
                    // Check squad mode
                    if (isSquad(data.you, snake)) {
                        continue;
                    }
                    return 0;
                }
            }
        }
    }

    // if (isOwnTail(data, x, y)) {
    //     return 100;
    // }

    // if (isNearTail(data, x, y)) {
    //     return 75;
    // }

    if (isDeadEnd(data, x, y) && !isNearTail(data, x, y)) {
        return 0;
    }

    const fillCount = floodFill(data, x, y);
    if (fillCount < data.you.body.length) {
        result = Math.min(result, fillCount);
    }

    if (blockHeads) {
        for (const snake of data.board.snakes) {
            const body = snake.body;
            for (const [p, part] of body.entries()) {
                // Is near head?
                if (snake.id != data.you.id && p == 0 && snake.body.length >= data.you.body.length) {
                    const distance = gridDistance(x, y, part.x, part.y);
                    if (distance < 3) {
                        result = Math.min(result, distance * 10);
                    }
                }
            }
        }
    }

    for (const snake of data.board.snakes) {
        const body = snake.body;
        for (const [p, part] of body.entries()) {
            let tailWeight = 40;
            if (p == body.length - 1) {
                tailWeight = 55;
            }
            if (x + 1 == part.x && y == part.y) {
                result = Math.min(result, tailWeight);
            }
            if (x - 1 == part.x && y == part.y) {
                result = Math.min(result, tailWeight);
            }
            if (x == part.x && y + 1 == part.y) {
                result = Math.min(result, tailWeight);
            }
            if (x == part.x && y - 1 == part.y) {
                result = Math.min(result, tailWeight);
            }
        }
    }

    // Borders
    if (x == 0) {
        result = Math.min(result, 35);
    }

    if (y == 0) {
        result = Math.min(result, 35);
    }

    if (x == data.board.width - 1) {
        result = Math.min(result, 35);
    }

    if (y == data.board.height - 1) {
        result = Math.min(result, 35);
    }

    result = Math.min(result, 50);
    return result;
}
