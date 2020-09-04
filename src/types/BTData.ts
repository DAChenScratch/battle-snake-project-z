export interface BTData {
    game: {
        id: string,
        timeout: number,
    },
    turn: number,
    board: BTBoard,
    you: BTSnake,
}

export interface BTBoard {
    width: number,
    height: number,
    food: BTXY[],
    hazards?: BTXY[],
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

export class BTRequest {
    public cache: any = {};
    public grid: any[] = [];
    public readonly logs: any[] = [];

    constructor(
        public body: BTData,
        public storage: any,
    ) {
        for (let y = 0; y < body.board.height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < body.board.width; x++) {
                this.grid[y][x] = {
                };
            }
        }
    }

    public log(...args: any) {
        this.logs.push(args);
    }
}
