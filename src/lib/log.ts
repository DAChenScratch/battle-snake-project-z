const logging = false;

export function log(...args: any[]) {
    if (!logging) {
        return;
    }
    for (const arg of args) {
        if (typeof arg === 'string') {
            process.stdout.write(arg);
            process.stdout.write(' ');
        } else if (!isNaN(arg)) {
            process.stdout.write(arg.toString());
            process.stdout.write(' ');
        } else {
            process.stdout.write(JSON.stringify(arg, null, 4));
            process.stdout.write(' ');
        }
    }
    process.stdout.write('\n');
}
