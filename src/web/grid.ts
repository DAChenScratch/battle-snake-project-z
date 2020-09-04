import { BTData, initBTData } from '../types/BTData';
import snakes from "../server/snakes";
import { invertColor } from '../lib/invertColor';
import * as Color from 'color';

export interface MoveData {
    body: BTData,
    logs: string[],
}

export function loadGrid(moveJson) {
    const grid = $('.grid');

    const getCol = (x, y) => {
        return grid.find('.row').eq(y).find('.col').eq(x);
    };

    const drawBoard = (moveJson: MoveData) => {
        console.log('Loading move JSON', moveJson);
        $('.data').html(JSON.stringify(moveJson, null, 4));

        const snake = snakes.find(s => s.name == moveJson.body.you.name);
        if (snake) {
            console.log('Next move', snake.move(moveJson.body));
        }

        $('.log').html('');
        if (moveJson.logs) {
            for (const log of moveJson.logs) {
                $('<div>').text(log).appendTo('.log');
            }
        }

        grid.html('');
        for (var y = 0; y < moveJson.body.board.height; y++) {
            const row = $('<div>').addClass('row').appendTo(grid);
            for (var x = 0; x < moveJson.body.board.width; x++) {
                const gridCell = moveJson.body.grid ? moveJson.body.grid[y][x] : {};
                const col = $('<div>').addClass('col').css({
                    backgroundColor: gridCell.color || '#000000',
                    borderColor: new Color(gridCell.color || '#000000').darken(0.2).hex(),
                }).appendTo(row);
                const cellData = [];
                cellData.push(x + '/' + y);
                for (const key in gridCell) {
                    if (key === 'color') {
                        continue;
                    }
                    cellData.push(key + ': ' + gridCell[key]);
                }
                $('<div>').addClass('weight').html(cellData.join('<br/>')).css({
                    color: invertColor(gridCell.color || '#000000'),
                }).appendTo(col);
            }
        }
        for (const food of moveJson.body.board.food) {
            const col = getCol(food.x, food.y);
            $('<div>').addClass('food').appendTo(col);
        }
        if (moveJson.body.board.hazards) {
            for (const hazard of moveJson.body.board.hazards) {
                const col = getCol(hazard.x, hazard.y);
                col.css({
                    borderColor: '#ff0000',
                });
            }
        }
        for (const snake of moveJson.body.board.snakes) {
            let color = '#e74c3c';
            if (snake.id == moveJson.body.you.id) {
                color = '#2ecc71';
            } else if (moveJson.body.you.squad && moveJson.body.you.squad == snake.squad) {
                color = '#3c69e7';
            }
            for (const [p, part] of snake.body.entries()) {
                const col = getCol(part.x, part.y);
                $('<div>').addClass('snake').css({
                    backgroundColor: color,
                    borderColor: new Color(color).darken(0.2).hex(),
                    borderRadius: p == 0 ? 100 : 0,
                }).text(' ').appendTo(col);
            }
        }
    };

    drawBoard(moveJson);
};