export interface BTData {
    game: {
        id: string,
    },
    turn: number,
    board: {
        width: number,
        height: number,
        food: BTXY[],
        snakes: BTSnake[],
    },
    you: BTSnake,
    log: any[],
    cache: any,
    grid: any[]
}

export interface BTXY {
    x: number,
    y: number,
}

export interface BTSnake {
    id: string,
    name: string,
    health: number,
    body: BTXY[],
}

export function initBTData(data: BTData): BTData {
    data.cache = {};
    data.grid = [];
    for (let y = 0; y < data.board.height; y++) {
        data.grid[y] = [];
        for (let x = 0; x < data.board.width; x++) {
            data.grid[y][x] = {
                color: 'rgba(0, 0, 0, 1)',
            };
        }
    }
    return data;
}