import { BTData } from '../../types/BTData';
import { ProjectZ } from './project-z';
import { KeepAway } from './keep-away';
import { Rando } from './rando';
import { Tak } from './tak';
import { TailChase } from './tail-chase';
import { BaseSnake } from './base-snake';
import { ISnake } from './snake-interface';

const CRC32 = require('crc-32');

export class Aldo extends BaseSnake implements ISnake {
    public port: number = 9006;
    private options: any[];

    constructor() {
        super();
        this.options = [ProjectZ, KeepAway, Rando, Tak, TailChase];
    }

    start(data: BTData) {
        this.snake(data).start(data);
    }

    move(data: BTData) {
        return this.snake(data).move(data);
    }

    private snake(data: BTData) {
        const crc = Math.abs(CRC32.str(data.you.id));
        return new this.options[crc % this.options.length]();
    }
}
