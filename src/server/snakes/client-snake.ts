import { ISnake } from './snake-interface';
import { WebSocketClient } from '../../web/WebSocketClient';
import { GameManager } from '../../web/GameManager';

export class ClientSnake {
    public webSocketClient: WebSocketClient;

    constructor(
        public snake: ISnake,
        public gameManager: GameManager,
    ) {
        this.webSocketClient = new WebSocketClient(snake, gameManager);
    }
}
