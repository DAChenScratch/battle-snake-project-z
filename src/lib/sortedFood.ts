import { gridDistance } from './gridDistance';
import { log } from './log';
import { BTXY, BTData } from '../types/BTData';

interface Sorted {
    food: BTXY,
    distance: number,
}

export function sortedFood(data: BTData): Sorted[] {
    if (!data.board.food.length) {
        return [];
    }
    const result = [];
    for (const food of data.board.food) {
        result.push({
            food: food,
            distance: gridDistance(data.you.body[0].x, data.you.body[0].y, food.x, food.y),
        });
    }
    result.sort((a, b) => {
        return a.distance - b.distance;
    })
    return result;
}
