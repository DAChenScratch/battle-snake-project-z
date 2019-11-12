import { ProjectZ } from "./snakes/project-z";
import { Server } from "./Server";
import { Logger } from "../lib/log";
import { Writer } from "../lib/writeFile";
import { NN } from "./snakes/nn";
import { KeepAway } from "./snakes/keep-away";
import { Rando } from "./snakes/rando";
import { Tak } from "./snakes/tak";
import { TailChase } from "./snakes/tail-chase";
import { Aldo } from "./snakes/aldo";
import { Dunno } from "./snakes/dunno";
import snakes from "./snakes";

Logger.enabled = true;
Writer.enabled = true;

for (const port in snakes) {
    new Server(parseInt(port), new snakes[port](), false);
}
