import { BTData } from "../types/BTData";

const fs = require('fs');

export const Writer = {
    enabled: false,
};

export function writeFile(data: BTData, json: any) {
    if (!Writer.enabled) {
        return;
    }
    const path = __dirname + '/../../games/' + data.you.id + '.json';
    fs.writeFileSync(path, JSON.stringify(json, null, 4));
}
