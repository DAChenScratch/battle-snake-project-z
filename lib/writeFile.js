const fs = require('fs')

writeFile = (data, updater) => {
    const path = __dirname + '/../games/' + data.game.id + '.json';
    let json = {};
    try {
        if (fs.existsSync(path)) {
            const content = fs.readFileSync(path);
            if (content) {
                json = JSON.parse(content) || {};
            }
        }
    } catch (e) {
        console.error(e);
    }
    updater(json);
    fs.writeFileSync(path, JSON.stringify(json, null, 4));
};
