import { Game } from './Game';

export class GameManager {
    public games = {};

    public getGame(gameId: string): Game {
        if (!this.games[gameId]) {
            this.games[gameId] = new Game(gameId);
        }
        return this.games[gameId];
    }
}
