import { gridDistance } from './gridDistance';
import { BTData } from '../types/BTData';
import { isFree } from './isFree';

export const BLOCKED_THRESHOLD = 10;

export function floodFill(data: BTData, x: number, y: number) {
    if (!data.floodFillCache) {
        data.floodFillCache = {};
    }
    const key = x + ':' + y;
    if (!data.floodFillCache[key]) {
        data.floodFillCache[key] = floodFillCache(data, x, y);
    }
    return data.floodFillCache[key];
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
        data.floodFillCache[key] = count;
    }
    return count;
};

const isDeadEnd = (data: BTData, x: number, y: number) => {
    if (!isFree(data, x - 1, y) && !isFree(data, x + 1, y) && !isFree(data, x, y - 1) && !isFree(data, x, y + 1)) {
        return true;
    }
    return false;
};

export function weight(data: BTData, x: number, y: number, blockHeads = true) {
    if (!data.weightCache) {
        data.weightCache = {};
    }
    const key = x + ':' + y + ':' + (blockHeads ? 1 : 0);
    if (!data.weightCache[key]) {
        data.weightCache[key] = weightCache(data, x, y, blockHeads);
    }
    return data.weightCache[key];
}

export function weightCache(data: BTData, x: number, y: number, blockHeads = true) {
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
                    return 0;
                }
            }
        }
    }

    if (isDeadEnd(data, x, y)) {
        return 0;
    }

    const fillCount = floodFill(data, x, y);
    if (fillCount < data.you.body.length) {
        return fillCount;
    }

    if (blockHeads) {
        for (const snake of data.board.snakes) {
            const body = snake.body;
            for (const [p, part] of body.entries()) {
                // Is near head?
                if (snake.id != data.you.id && p == 0) {
                    const distance = gridDistance(x, y, part.x, part.y);
                    if (distance < 4) {
                        return distance * 10;
                    }
                }
            }
        }
    }

    for (const snake of data.board.snakes) {
        const body = snake.body;
        for (const [p, part] of body.entries()) {
            if (x + 1 == part.x && y == part.y) {
                return 40;
            }
            if (x - 1 == part.x && y == part.y) {
                return 40;
            }
            if (x == part.x && y + 1 == part.y) {
                return 40;
            }
            if (x == part.x && y - 1 == part.y) {
                return 40;
            }
        }
    }


    if (x == 0) {
        return 40;
    }

    if (y == 0) {
        return 40;
    }

    if (x == data.board.width - 1) {
        return 40;
    }

    if (y == data.board.height - 1) {
        return 40;
    }

    return 50;
}
