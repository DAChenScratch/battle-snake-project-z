import { BTData, BTSnake } from '../types/BTData';

interface TurnList {
    [turnNumber: string]: BTData,
}

export class Game {
    public start: BTData;
    public turns: TurnList = {};
    public end: BTData;
    public pending: boolean = false;
    public started?: Date;
    public finished?: Date;
    public winner?: BTSnake;

    constructor(
        public index: number,
        public id: string,
    ) {
        this.pending = true;
    }

    public setStart(data: BTData) {
        this.start = data;
    }

    public setTurn(data: BTData) {
        this.turns[data.turn] = data;
    }

    public setEnd(data: BTData) {
        this.end = data;
        this.finished = new Date();
        this.winner = data.board.snakes[0];
        if (data.board.snakes[0]) {
            this.winner = data.board.snakes[0];
            // this.winner.wins++;
            // if (this.winner.wins.indexOf(this.id) === -1) {
            //     this.winner.wins.push(this.id);
            // }
        }
    }

    public get moves(): number {
        let maxTurn = 0;
        for (let t in this.turns) {
            const turnNumber = parseInt(t);
            if (turnNumber > maxTurn) {
                maxTurn = turnNumber;
            }
        }
        return maxTurn;
    }

    public get lastTurn(): BTData {
        return this.turns[this.moves];
    }

    public get snakes(): BTSnake[] {
        const snakes = {};
        for (const t in this.turns) {
            for (const snake of this.turns[t].board.snakes) {
                snakes[snake.id] = snake;
            }
        }
        if (this.end) {
            for (const snake of this.end.board.snakes) {
                snakes[snake.id].alive = true;
            }
        } else if (this.lastTurn) {
            for (const snake of this.lastTurn.board.snakes) {
                snakes[snake.id].alive = true;
            }
        }
        return Object.values(snakes);
    }
}
