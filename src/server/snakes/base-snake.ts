import { Server } from '../Server';
import { BTRequest } from '../../types/BTData';
import { MoveDirection } from '../../types/MoveDirection';

export interface StateFunction {
    (request: BTRequest): MoveDirection
}

export abstract class BaseSnake {
    public info: any = {};
    public server: Server;
    public wins: number = 0;
    public enabled: boolean = false;
    public port: number;

    protected states: StateFunction[];

    constructor() {
        this.info.name = this.name;
    }

    public start(request: BTRequest): void {
    }

    public move(request: BTRequest) {
        let direction;
        for (const state of this.states) {
            if (direction = state(request)) {
                request.log(state.name);
                return {
                    move: direction,
                    shout: state.name,
                };
            }
        }
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
