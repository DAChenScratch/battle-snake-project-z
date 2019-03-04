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
