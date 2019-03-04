import { BTData } from "../types/BTData";

const fs = require('fs');

export const Writer = {
    enabled: false,
};

export function writeFile(id: string, json: any) {
    if (!Writer.enabled) {
        return;
    }
    const path = __dirname + '/../../games/' + id + '.json';
    console.log('Writing file', path);
    fs.writeFileSync(path, JSON.stringify(json, null, 4));
}
