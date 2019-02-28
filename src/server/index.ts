import { ProjectZ } from "./snakes/project-z";
import { Server } from "./Server";
import { Logger } from "../lib/log";
import { Writer } from "../lib/writeFile";
import { NN } from "./snakes/nn";

Logger.enabled = true;
Writer.enabled = true;

new Server(9001, new ProjectZ(), true);
new Server(9002, new NN(), false);
