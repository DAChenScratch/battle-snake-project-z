import { BTData } from '../../types/BTData';
import { ProjectZ } from './project-z';
import { KeepAway } from './keep-away';
import { Rando } from './rando';
import { Tak } from './tak';
import { TailChase } from './tail-chase';
import { Color } from '../../types/Color';
import { HeadType } from '../../types/HeadType';
import { TailType } from '../../types/TailType';

export class Dunno {
    private options: any[];

    constructor() {
        this.options = [ProjectZ, KeepAway, Rando, Tak, TailChase];
    }

    start(data: BTData) {
        return {
            color: Color.BLUE,
            headType: HeadType.SAFE,
            tailType: TailType.ROUND_BUM,
        };
    }

    move(data: BTData) {
        return this.snake(data).move(data);
    }

    private snake(data: BTData) {
        return new this.options[Math.floor(Math.random() * this.options.length)]();
    }
}
