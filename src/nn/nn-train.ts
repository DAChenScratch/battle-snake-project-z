import { trainer, generateConfig } from "./nn-trainer";
import { logInput } from "./nn-bt-data-grid";

const brain = require('brain.js');
const crypto = require('crypto');
const fs = require('fs');

const readDir = (path): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (error, files) => {
            error ? reject(error) : resolve(files);
        });
    });
};

const readFile = (file): Promise<any> => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (error, json) => {
            error ? reject(error) : resolve(JSON.parse(json));
        });
    });
};

(async () => {
    const gamesPath = __dirname + '/../../games/';
    const nnPath = __dirname + '/../../networks/';
    let trainingData = [];

    console.log(gamesPath);
    const files = await readDir(gamesPath);

    const hash = crypto.createHash('md5');;
    for (const file of files) {
        if (!file.match(/\.json$/)) {
            continue;
        }
        const data = await readFile(gamesPath + file);
        if (data.end.you.id == data.moves[data.moves.length - 1].board.snakes[0].id && data.moves.length > 50) {
            console.log(file);
            hash.update(file);
            trainingData = trainingData.concat(data.trainingData);
            // break;
        }
    }
    // trainingData = trainingData.splice(0, 4);
    for (const t of trainingData) {
        // logInput(t.input);
        // console.log(t.output);
        // process.stdout.write('\n');
        t.input = t.input.map(v => parseFloat((v / 7).toFixed(2)));
    }

    // console.log(JSON.stringify(trainingData));

    console.log('Training data size:', trainingData.length)
    const config = generateConfig(100, 2);
    console.log(config);
    const net = await trainer(trainingData, config, 1000);
    console.log('Training done');
    const networkFile = nnPath + hash.digest('hex') + '.json';
    fs.writeFileSync(networkFile, JSON.stringify(net.toJSON(), null, 4));
    console.log(networkFile);
})();

export {};
