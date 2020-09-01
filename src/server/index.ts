import { Server } from "./Server";
import { Logger } from "../lib/log";
import { Writer } from "../lib/writeFile";
import snakes from "./snakes";

Logger.enabled = false;
Writer.enabled = false;

for (const snake of snakes) {
    new Server(snake.port, snake, true);
}