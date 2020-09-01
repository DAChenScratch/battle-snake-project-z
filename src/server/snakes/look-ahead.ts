import { BTData } from '../../types/BTData';
import { Color } from '../../types/Color';
import { HeadType } from '../../types/HeadType';
import { TailType } from '../../types/TailType';
import { BaseSnake } from './base-snake';
import { lookAhead } from '../../lib/lookAhead';
import { ISnake } from './snake-interface';

export class LookAhead extends BaseSnake implements ISnake {
    public port: number = 9010;

    public color = Color.PLUM;
    public headType = HeadType.TONGUE;
    public tailType = TailType.SHARP;

    move(data: BTData) {
        return {
            move: lookAhead(data),
        };
    }
}
