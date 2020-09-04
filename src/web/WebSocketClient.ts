import { ISnake } from '../server/snakes/snake-interface';
import { GameManager } from './GameManager';
import { AngularScope } from './angular-scope';
import { log } from '../lib/log';

export class WebSocketClient {
    private socket: WebSocket;
    private url: string;
    private debounce = null;

    constructor(
        public snake: ISnake,
        private snakes: ISnake[],
        private gameManager: GameManager,
        private scope: AngularScope,
    ) {
        this.url = `ws://localhost:1${snake.port}/`;
        this.connect();
    }

    private connect() {
        console.log('Connect web socket', this.url);
        this.socket = new WebSocket(this.url);
        this.socket.onmessage = this.handleWebsocketMessage.bind(this);
        this.socket.onclose = this.handleWebsocketClose.bind(this);
    }

    handleWebsocketMessage(string) {
        const { message, data } = JSON.parse(string.data);
        // console.log('Received message', message);
        switch (message) {
            case 'snake':
                data.wins = [];
                // this.snakes.push(data);
                break;
        }

        const body = data.body;

        if (body && body.game) {
            let game;
            switch (message) {
                case 'start':
                    log.verbose('Received game started', body.game.id, this.gameManager);
                    game = this.gameManager.getGame(body.game.id);
                    if (!game) {
                        game = this.gameManager.initGame(body.game.id);
                    }
                    // game.start = body;
                    // game.snakes.push(data.snake);
                    break;
                case 'move':
                    game = this.gameManager.getGame(body.game.id);
                    if (game) {
                        game.setTurn(body);
                        // game.moves++;
                        // game.moves.push(body);
                    }
                    break;
                case 'end':
                    game = this.gameManager.getGame(body.game.id);
                    if (game) {
                        log.verbose('Received game ended', body.game.id, this.gameManager);
                        // game.end = body;
                        game.finished = new Date();
                        if (body.board.snakes[0] && body.board.snakes[0].name == this.snake.name) {
                            game.winner = this.snakes.find(s => s.name == body.board.snakes[0].name);
                            game.winner.wins++;
                            // if (game.winner.wins.indexOf(game.id) === -1) {
                            //     game.winner.wins.push(game.id);
                            // }
                        }
                        this.scope.$broadcast('end');
                    }
                    break;
            }
        }
        // if (!this.debounce) {
        //     this.debounce = setTimeout(() => {
        //         this.debounce = null;
        //         this.scope.$apply();
        //     }, 100);
        // }
    }

    handleWebsocketClose() {
        console.log('Web socket close', this.url);
        setTimeout(() => {
            this.connect();
        }, 500);
    }
}

// this.socket.send(JSON.stringify({ msg: 'clear' }));