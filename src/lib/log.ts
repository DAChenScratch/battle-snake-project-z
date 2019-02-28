export const Logger = {
    enabled: false,
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
            line += JSON.stringify(arg, null, 4);
        }
        line += ' ';
    }
    logs.push(line);
    process.stdout.write(line + '\n');
}
