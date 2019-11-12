import { server, connection } from 'websocket';
import * as http from 'http';
import { log } from '../lib/log';
import { Snake } from './Server';

export class WebSocketServer {
    private connections: connection[] = [];
    private wsServer: server;

    constructor(
        private port: number,
        private snake: Snake,
    ) {
        log('Web socket start server', port + 10000);

        const httpServer = http.createServer((request, response) => {
        });

        httpServer.listen(port + 10000, () => { });

        this.wsServer = new server({
            httpServer,
        });

        this.wsServer.on('request', (request) => {
            const connection = request.accept(null, request.origin);

            connection.on('message', (message) => {
                log('Web socket message', message);
            });

            connection.on('close', (connection) => {
                log('Web socket close', connection);
            });

            this.connections.push(connection);

            this.send(connection, 'snake', {
                name: this.snake.constructor.name,
                port: this.port,
            });
        });
    }

    public broadcast(message: string, data) {
        const string = JSON.stringify({ message, data });
        // log('Web socket broadcast', string);
        this.wsServer.broadcast(string);
    }

    private send(connection: connection, message: string, data) {
        const string = JSON.stringify({ message, data });
        // log('Web socket send', string);
        connection.send(string);
    }
}