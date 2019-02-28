import { trainer } from "./nn-trainer";

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
        console.log(file);
        const data = await readFile(gamesPath + file);
        if (data.end.you.id == data.moves[data.moves.length - 1].board.snakes[0].id) {
            hash.update(file);
            trainingData = trainingData.concat(data.trainingData);
        }
    }

    console.log('Training data size:', trainingData.length)
    const net = await trainer(trainingData);
    fs.writeFileSync(nnPath + hash.digest('hex') + '.json', JSON.stringify(net.toJSON(), null, 4));
});

export {};
