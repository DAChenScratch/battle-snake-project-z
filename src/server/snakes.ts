import { ProjectZ } from "./snakes/project-z";
// import { NN } from "./snakes/nn";
import { KeepAway } from "./snakes/keep-away";
import { Rando } from "./snakes/rando";
import { Tak } from "./snakes/tak";
import { TailChase } from "./snakes/tail-chase";
import { Aldo } from "./snakes/aldo";
import { Dunno } from "./snakes/dunno";
import { WorkItOut } from "./snakes/work-it-out";
import { ProjectZ2 } from "./snakes/project-z-2";
import { LookAhead } from "./snakes/look-ahead";
import { BaseSnake } from "./snakes/base-snake";
import { ISnake } from './snakes/snake-interface';

const snakes: ISnake[] = [
    new ProjectZ(),
    new KeepAway(),
    new Rando(),
    new Tak(),
    new TailChase(),
    new Aldo(),
    new Dunno(),
    new WorkItOut(),
    new ProjectZ2(),
    new LookAhead(),
];

export default snakes;
