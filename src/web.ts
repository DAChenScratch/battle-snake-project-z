import { loadGrid } from "./web/grid";
import { train } from "./web/train";
import { Logger } from "./lib/log";

Logger.console = true;
Logger.enabled = true;

declare global {
    interface Window {
        loadGrid: any;
        train: any;
    }
}

window.loadGrid = window.loadGrid || loadGrid;
window.train = window.train || train;
