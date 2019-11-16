import { Server } from "./Server";
import { Logger } from "../lib/log";
import { Writer } from "../lib/writeFile";
import snakes from "./snakes";

Logger.enabled = true;
Writer.enabled = true;

for (const port in snakes) {
    new Server(parseInt(port), new snakes[port](), false);
}