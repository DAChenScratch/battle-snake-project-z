import * as fs from 'fs';
import * as zlib  from 'zlib';

export const Writer = {
    enabled: false,
};

export function writeFile(gameId: string, snakeId: string, snakeName: string, type: string, json: any) {
    if (!Writer.enabled) {
        return;
    }

    let index: string;
    if (type === 'start') {
        index = '0000';
    }
    if (type === 'move') {
        index = String(json.body.turn + 1).padStart(4, '0');
    }
    if (type === 'end') {
        index = '9999';
    }

    const directory = `${__dirname}/../../games/${gameId}/${snakeName}_${snakeId}/`;
    const file = `${directory}/${index}_${type}.json.gz`;

    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, {
            recursive: true,
        });
    }

    fs.writeFileSync(file, zlib.gzipSync(JSON.stringify(json)));
    fs.chmodSync(file, 0o777);
}
