import * as fs from 'fs';

export const Writer = {
    enabled: false,
};

export function writeFile(gameId: string, snakeId: string, type: string, json: any) {
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

    const directory = `${__dirname}/../../games/${gameId}/${snakeId}/`;
    const file = `${directory}/${index}_${type}.json`;

    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, {
            recursive: true,
        });
    }

    fs.writeFileSync(file, JSON.stringify(json, null, 4));
    fs.chmodSync(file, 0o777);
}
