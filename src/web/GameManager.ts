import { Game } from './Game';

export class GameManager {
    public games: Game[] = [];

    public getGame(gameId: string): Game {
        let game = this.games.find(g => g.id == gameId);
        if (!game) {
            game = new Game(this.games.length, gameId);
            this.games.push(game);
        }
        return game;
    }
}
