import { BTData } from "../types/BTData";
import { ServerMoveResponse } from "../server/Server";
import { MoveDirection } from "../types/MoveDirection";

enum Token {
    EMPTY = 0,
    FOOD = 1,
    SELF = 2,
    SELF_HEAD = 3,
    SELF_TAIL = 4,
    ENEMY = 5,
    ENEMY_HEAD = 6,
    ENEMY_TAIL = 7,
}

export function dataToInput(data: BTData) {
    const input = [];
    for (let y = 0; y < data.board.height; y++) {
        for (let x = 0; x < data.board.width; x++) {
            input[y * data.board.height + x] = Token.EMPTY;
        }
    }
    for (const food of data.board.food) {
        input[food.y * data.board.height + food.x] = Token.FOOD;
    }

    for (const snake of data.board.snakes) {
        for (let p = 0; p < snake.body.length; p++) {
            const part = snake.body[p];
            if (p == 0) {
                input[part.y * data.board.height + part.x] = Token.ENEMY_HEAD;
            } else if (p == snake.body.length - 1) {
                input[part.y * data.board.height + part.x] = Token.ENEMY_TAIL;
            } else {
                input[part.y * data.board.height + part.x] = Token.ENEMY;
            }
        }
    }

    const snake = data.you;
    for (let p = 0; p < snake.body.length; p++) {
        const part = snake.body[p];
        if (p == 0) {
            input[part.y * data.board.height + part.x] = Token.SELF_HEAD;
        } else if (p == snake.body.length - 1) {
            input[part.y * data.board.height + part.x] = Token.SELF_TAIL;
        } else {
            input[part.y * data.board.height + part.x] = Token.SELF;
        }
    }

    return input;
}

// export function moveToOutput(response: ServerMoveResponse) {
//     switch (response.move) {
//         case MoveDirection.UP:
//             return [1, 0, 0, 0];
//         case MoveDirection.DOWN:
//             return [0, 1, 0, 0];
//         case MoveDirection.LEFT:
//             return [0, 0, 1, 0];
//         case MoveDirection.RIGHT:
//             return [0, 0, 0, 1];
//     }
//     return [0, 0, 0, 0];
// }

export function logInput(input: number[]) {
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            process.stdout.write(input[y * 10 + x].toString());
            process.stdout.write(' ');
        }
        process.stdout.write('\n');
    }
}
