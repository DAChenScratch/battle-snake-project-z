import { BTData } from '../types/BTData';

export class Game {
    public turns: BTData[] = [];

    constructor(
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
