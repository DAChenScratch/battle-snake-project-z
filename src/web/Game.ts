import { BTData } from '../types/BTData';
import { ISnake } from '../server/snakes/snake-interface';

export class Game {
    public turns: BTData[] = [];
    public finished?: Date;
    public winner?: ISnake;

    constructor(
        public index: number,
        public id: string,
    ) {
    }

    public setTurn(data: BTData) {
        this.turns[data.turn] = data;
    }

    public get moves(): number {
        let maxTurn = 0;
        for (const data of this.turns) {
            if (data.turn > maxTurn) {
                maxTurn = data.turn;
            }
        }
        return maxTurn;
    }
}
