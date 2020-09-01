import { ISnake } from './snake-interface';
import { Server } from '../Server';
import { WebSocketClient } from '../../web/WebSocketClient';
import { HeadType } from '../../types/HeadType';
import { TailType } from '../../types/TailType';
import { Color } from '../../types/Color';
import { BTData } from '../../types/BTData';

export abstract class BaseSnake {
    public info: any = {};
    public server: Server;
    public wins: number = 0;
    public enabled: boolean = false;
    public port: number;

    constructor() {
        this.info.name = this.name;
    }

    start(data: BTData): void {
    }

    public get name() {
        return this.constructor.name;
    }

    public get config() {
        return {
            name: this.name,
            url: `http://localhost:${this.port}/`,
        };
    }
}
