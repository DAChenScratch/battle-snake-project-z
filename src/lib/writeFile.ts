import { BTData } from "../types/BTData";

const fs = require('fs');

const recording = false;

export function writeFile(data: BTData, updater: (json: any) => void) {
    if (!recording) {
        return;
    }
    const path = __dirname + '/../../games/' + data.you.id + '.json';
    let json;
    try {
        if (fs.existsSync(path)) {
            const content = fs.readFileSync(path);
            if (content) {
                json = JSON.parse(content);
            }
        }
    } catch (e) {
        console.error(e);
    }
    if (typeof json !== 'object') {
        json = {};
    }
    updater(json);
    fs.writeFileSync(path, JSON.stringify(json, null, 4));
}
