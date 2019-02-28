import { BTData } from "../types/BTData";
import { ServerMoveResponse } from "../server/Server";
import { MoveDirection } from "../types/MoveDirection";

const FOOD_COUNT = 30;
const MAX_BOARD_SIZE = 19;
const MIN_POSITION = 1 / MAX_BOARD_SIZE;
const MAX_SNAKES = 2;
const MAX_SNAKE_LENGTH = 100;

// const gamesPath = __dirname + '/../../games/';
// const fs = require('fs');
// console.log(gamesPath);
// fs.readdir(gamesPath, (error, files) => {
//     if (error) {
//         throw error;
//     }
//     for (const file of files) {
//         if (!file.match(/\.json$/)) {
//             continue;
//         }
//         console.log(file);
//         fs.readFile(gamesPath + file, (error, data) => {
//             if (error) {
//                 throw error;
//             }
//             const btData = JSON.parse(data);
//             const turn = btData.start;
//             const input = dataToInput(turn);
//             logInput(input);
//         });
//     }
// });

const addSnakeToInput = (input, snake) => {
    if (snake) {
        input.push(snake.health / 100);
        for (let p = 0; p < MAX_SNAKE_LENGTH; p++) {
            const part = snake.body[p];
            if (part) {
                input.push(part.x / MAX_BOARD_SIZE + MIN_POSITION);
                input.push(part.y / MAX_BOARD_SIZE + MIN_POSITION);
            } else {
                input.push(0);
                input.push(0);
            }
        }
    } else {
        input.push(0);
        for (let p = 0; p < MAX_SNAKE_LENGTH; p++) {
            input.push(0);
            input.push(0);
        }
    }
};

export function dataToInput(data: BTData) {
    const input = [
        data.board.width / MAX_BOARD_SIZE,
        data.board.height / MAX_BOARD_SIZE,
    ];
    for (let f = 0; f < FOOD_COUNT; f++) {
        const food = data.board.food[f];
        if (food) {
            input.push(food.x / MAX_BOARD_SIZE + MIN_POSITION);
            input.push(food.y / MAX_BOARD_SIZE + MIN_POSITION);
        } else {
            input.push(0);
            input.push(0);
        }
    }

    addSnakeToInput(input, data.you);
    for (let s = 0; s < MAX_SNAKES; s++) {
        const snake = data.board.snakes[s];
        if (snake.id == data.you.id) {
            continue;
        }
        addSnakeToInput(input, snake);
    }

    return input;
}

export function moveToOutput(response: ServerMoveResponse) {
    switch (response.move) {
        case MoveDirection.UP:
            return [1, 0, 0, 0];
        case MoveDirection.DOWN:
            return [0, 1, 0, 0];
        case MoveDirection.LEFT:
            return [0, 0, 1, 0];
        case MoveDirection.RIGHT:
            return [0, 0, 0, 1];
    }
    return [0, 0, 0, 0];
}

export function logInput(input: number[]) {
    let offset = 0;
    console.log('Width:', offset, input[offset++]);
    console.log('Height:', offset, input[offset++]);

    console.log('Food:');
    for (let f = 0; f < FOOD_COUNT; f++) {
        console.log(offset, input[offset++], input[offset++]);
    }

    console.log('Snakes:');
    for (let s = 0; s < MAX_SNAKES; s++) {
        console.log('Health:', offset, input[offset++]);
        console.log('Parts:');
        for (let p = 0; p < MAX_SNAKE_LENGTH; p++) {
            console.log(offset, input[offset++], input[offset++]);
        }
    }
    console.log('Count:', input.length, offset);
}
