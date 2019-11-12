export class WebSocketClient {
    private socket: WebSocket;
    private url: string;

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
                this.scope.snakes.push(data);
                break;
        }

        if (data.game) {
            const game = this.scope.games.find(g => !g.id || g.id === data.game.id);;
            switch (message) {
                case 'start':
                    game.id = data.game.id;
                    game.start = data;
                    break;
                case 'move':
                    game.moves.push(data);
                    break;
                case 'end':
                    game.end = data;
                    game.finished = new Date();
                    game.moves.push(data);
                    this.scope.$broadcast('end');
                    break;
            }
        }
        this.scope.$apply();
    }

    handleWebsocketClose() {
        console.log('Web socket close', this.url);
    }
}

// this.socket.send(JSON.stringify({ msg: 'clear' }));