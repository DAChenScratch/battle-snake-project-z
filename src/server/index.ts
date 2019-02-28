import { ProjectZ } from "./snakes/project-z";
import { Server } from "./Server";

const snake = new ProjectZ();
const server = new Server(9001, snake.start, snake.move);
