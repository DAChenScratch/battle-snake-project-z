import { Server } from "./Server";
import { Logger, log } from "../lib/log";
import { Writer } from "../lib/writeFile";
import snakes from "./snakes";

const env = require(__dirname + '/../../env.json');

Logger.enabled = env.logger.enabled;
Logger.console = env.logger.console;
Logger.stdout = env.logger.stdout;
Writer.enabled = env.writer.enabled;

log('Env', env);

for (const snake of snakes) {
    new Server(snake.port, snake, env.writer.enabled, env.apiVersion, env.logHttp);
}