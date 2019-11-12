import { loadGrid } from "./web/grid";
import { train } from "./web/train";
import { Logger } from "./lib/log";
import app from "./web/app";

Logger.console = true;
Logger.enabled = true;

declare global {
    interface Window {
        loadGrid: any;
        train: any;
        app: any;
    }
}

window.loadGrid = window.loadGrid || loadGrid;
window.train = window.train || train;
window.app = window.app || app;
console.log('web');
