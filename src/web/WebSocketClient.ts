import { ISnake } from '../server/snakes/snake-interface';
import { GameManager } from './GameManager';
import { AngularScope } from './angular-scope';

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
            const game = this.gameManager.getGame(body.game.id);

            switch (message) {
                case 'start':
                    game.id = body.game.id;
                    // game.start = body;
                    // game.snakes.push(data.snake);
                    break;
                case 'move':
                    game.setTurn(body);
                    // game.moves++;
                    // game.moves.push(body);
                    break;
                case 'end':
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
    }
}

// this.socket.send(JSON.stringify({ msg: 'clear' }));