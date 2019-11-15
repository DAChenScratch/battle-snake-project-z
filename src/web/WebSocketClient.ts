export class WebSocketClient {
    private socket: WebSocket;
    private url: string;
    private debounce = null;

    constructor(
        private scope,
        private port: number,
    ) {
        this.url = `ws://localhost:1${port}/`;
        console.log('Connect web socket', this.url);

        this.socket = new WebSocket(this.url);
        this.socket.onmessage = this.handleWebsocketMessage.bind(this);
        this.socket.onclose = this.handleWebsocketClose.bind(this);
    }

    handleWebsocketMessage(string) {
        const { message, data } = JSON.parse(string.data);
        switch (message) {
            case 'snake':
                data.wins = [];
                this.scope.snakes.push(data);
                break;
        }

        if (data.game) {
            const game = this.scope.games.find(g => !g.id || g.id === data.game.id);;
            if (!game) {
                console.log('Unknown game', game);
                return;
            }
            switch (message) {
                case 'start':
                    game.id = data.game.id;
                    game.start = data;
                    break;
                case 'move':
                    game.moves++;
                    // game.moves.push(data);
                    break;
                case 'end':
                    game.end = data;
                    game.finished = new Date();
                    if (data.board.snakes[0]) {
                        game.winner = this.scope.snakes.find(s => s.name == data.board.snakes[0].name);
                        if (game.winner.wins.indexOf(game.id) === -1) {
                            game.winner.wins.push(game.id);
                        }
                    }
                    this.scope.$broadcast('end');
                    break;
            }
        }
        if (!this.debounce) {
            this.debounce = setTimeout(() => {
                this.debounce = null;
                this.scope.$apply();
            }, 100);
        }
    }

    handleWebsocketClose() {
        console.log('Web socket close', this.url);
    }
}

// this.socket.send(JSON.stringify({ msg: 'clear' }));