export class BaseSnake {
    public info: any = {};

    constructor() {
        this.info.name = this.constructor.name;
    }
}
