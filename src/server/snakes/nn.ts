import { BTData } from '../../types/BTData';
import { Color } from '../../types/Color';
import { HeadType } from '../../types/HeadType';
import { TailType } from '../../types/TailType';
import { MoveDirection } from '../../types/MoveDirection';
import { dataToInput } from '../../nn/nn-bt-data';

const brain = require('brain.js');
const network = require('../../../networks/c7d542bbeeee546f7334d8ab3310db72.json');

export class NN {
    private net;

    constructor() {
        this.net = new brain.NeuralNetworkGPU();
        this.net.fromJSON(network);
    }

    start(data: BTData) {
        return {
            color: Color.GREEN,
            headType: HeadType.BENDR,
            tailType: TailType.BOLT,
        };
    }

    move(data: BTData) {
        const output = this.net.run(dataToInput(data));
        console.log(output);

        var indexOfMaxValue = output.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
        let direction;
        switch (indexOfMaxValue) {
            case 0:
                direction = MoveDirection.UP;
                break;
            case 1:
                direction = MoveDirection.DOWN;
                break;
            case 2:
                direction = MoveDirection.LEFT;
                break;
            case 3:
                direction = MoveDirection.RIGHT;
                break;
        }

        return {
            move: direction,
        };
    }
}
