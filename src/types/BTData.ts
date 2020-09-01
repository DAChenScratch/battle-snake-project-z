export interface BTData {
    game: {
        id: string,
        timeout: number,
    },
    turn: number,
    board: BTBoard,
    you: BTSnake,
    log: any[],
    cache: any,
    grid: any[]
}

export interface BTBoard {
    width: number,
    height: number,
    food: BTXY[],
    hazards: BTXY[],
    snakes: BTSnake[],
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
    head: BTXY,
    length: number,
    shout: string,
    squad: string,
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