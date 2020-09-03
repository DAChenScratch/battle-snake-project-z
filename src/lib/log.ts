const util = require('util');

export const Logger = {
    enabled: false,
    console: false,
    stdout: false,
};

export const logs = [];

export function log(...args: any[]) {
    if (!Logger.enabled) {
        return;
    }

    let line = '';
    for (const arg of args) {
        if (typeof arg === 'string') {
            line += arg;
        } else if (arg === null) {
            line += 'null';
        } else if (arg === undefined) {
            line += 'null';
        } else if (!isNaN(arg)) {
            line += arg.toString();
        } else {
            line += util.inspect(arg, {
                showHidden: false,
                depth: null,
            });
        }
        line += ' ';
    }
    logs.push(line);
    if (Logger.console) {
        console.log(line);
    } else if (Logger.stdout) {
        process.stdout.write(line + '\n');
    }
}

log.verbose = (...args: any[]) => { };
