import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

const time = new Date().getTime();

async function fetchData(url) {
    const result = await axios.get(url);
    return cheerio.load(result.data);
}

async function scrape(name, url) {
    const scrapeFile = `${__dirname}/../../scrapes/${name}.json`;
    let dates: any;
    try {
        dates = fs.readFileSync(scrapeFile);
        dates = JSON.parse(dates);
    } catch (error) {
        console.error(error);
        dates = {};
    }

    const $ = await fetchData(url);
    const ranks = {};
    $('#tab-leaderboard table tbody tr').each((index, element) => {
        const rank = $(element).find('.rank').text().trim();
        const nameColumn = $(element).find('td').eq(2);
        const name = $(nameColumn).find('a').first().text().trim();
        ranks[name] = rank;
    });
    console.log(name, ranks);
    dates[time] = ranks;

    fs.writeFileSync(scrapeFile, JSON.stringify(dates, null, 4));
}

Promise.all([
    scrape('summer-challenge-squads', 'https://play.battlesnake.com/arena/summer-challenge-squads/'),
    scrape('summer-veteran', 'https://play.battlesnake.com/arena/summer-veteran/'),
    scrape('global', 'https://play.battlesnake.com/arena/global/'),
]);
