import { ProjectZ } from "./snakes/project-z";
import { Server } from "./Server";
import { Logger } from "../lib/log";
import { Writer } from "../lib/writeFile";
import { NN } from "./snakes/nn";
import { KeepAway } from "./snakes/keep-away";
import { Rando } from "./snakes/rando";
import { Tak } from "./snakes/tak";

Logger.enabled = true;
Writer.enabled = true;

new Server(9001, new ProjectZ(), true);
new Server(9002, new KeepAway(), true);
new Server(9003, new Rando(), true);
new Server(9004, new Tak(), true);
