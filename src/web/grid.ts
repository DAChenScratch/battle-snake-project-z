import { BTData, initBTData } from '../types/BTData';
import snakes from "../server/snakes";
import { invertColor } from '../lib/invertColor';

interface MoveData {
    body: BTData,
    logs: string[],
}

export function loadGrid(moveJson) {
    const grid = $('.grid');

    const getCol = (x, y) => {
        return grid.find('.row').eq(y).find('.col').eq(x);
    };

    const drawBoard = (moveJson: MoveData) => {
        const data = initBTData(moveJson.body);

        const snake = snakes.find(s => s.name == data.you.name);
        console.log(data, snake.move(data));
        $('.log').html('');
        if (moveJson.logs) {
            for (const log of moveJson.logs) {
                $('<div>').text(log).appendTo('.log');
            }
        }

        grid.html('');
        for (var y = 0; y < data.board.height; y++) {
            const row = $('<div>').addClass('row').appendTo(grid);
            for (var x = 0; x < data.board.width; x++) {
                const col = $('<div>').addClass('col').css({
                    backgroundColor: data.grid[y][x].color,
                }).appendTo(row);
                const cellData = [];
                cellData.push(x + '/' + y);
                for (const key in data.grid[y][x]) {
                    if (key === 'color') {
                        continue;
                    }
                    cellData.push(key + ': ' + data.grid[y][x][key]);
                }
                $('<div>').addClass('weight').html(cellData.join('<br/>')).css({
                    color: invertColor(data.grid[y][x].color),
                }).appendTo(col);
                // $('<div>').addClass('weight').html(x + '/' + y + '<br/>w:' + w + '<br/>' + (matrix[y][x] == FREE ? 'FREE' : 'BLOCKED') + '<br/>c:' + costs[y][x]).css({
                //     color: w < 60 ? 'white' : 'black',
                // }).appendTo(col);
            }
        }
        for (const food of data.board.food) {
            const col = getCol(food.x, food.y);
            $('<div>').addClass('food').appendTo(col);
        }
        for (const snake of data.board.snakes) {
            const color = snake.id == data.you.id ? '#2ecc71' : '#e74c3c';
            for (const [p, part] of snake.body.entries()) {
                const col = getCol(part.x, part.y);
                $('<div>').addClass('snake').css({
                    backgroundColor: color,
                    borderRadius: p == 0 ? 100 : 0,
                }).text(' ').appendTo(col);
            }
        }
    };

    drawBoard(moveJson);
};