import { BTRequest } from '../types/BTData';
import snakes from "../server/snakes";
import { invertColor } from '../lib/invertColor';
import * as Color from 'color';
import { clone } from '../lib/clone';

export function loadGrid(request: BTRequest) {
    const grid = $('.grid');

    const getCol = (x, y) => {
        return grid.find('.grid-row').eq(y).find('.grid-col').eq(x);
    };

    console.log('Loading request', request);
    $('.data').html(JSON.stringify(request, null, 4));

    const snake = snakes.find(s => s.name == request.body.you.name);
    if (snake) {
        const tempRequest = new BTRequest(clone(request.body), clone(request.storage));
        console.log('Next move', snake.move(tempRequest), tempRequest);
        for (const log of tempRequest.logs) {
            console.log(log);
        }
    }

    $('.log').html('');
    if (request.logs) {
        for (const log of request.logs) {
            $('<div>').text(log).appendTo('.log');
        }
    }

    grid.html('');
    for (var y = 0; y < request.body.board.height; y++) {
        const row = $('<div>').addClass('grid-row').appendTo(grid);
        for (var x = 0; x < request.body.board.width; x++) {
            const gridCell = request.grid ? request.grid[y][x] : {};
            const col = $('<div>').addClass('grid-col').css({
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
    for (const food of request.body.board.food) {
        const col = getCol(food.x, food.y);
        $('<div>').addClass('food').appendTo(col);
    }
    if (request.body.board.hazards) {
        for (const hazard of request.body.board.hazards) {
            const col = getCol(hazard.x, hazard.y);
            col.css({
                borderColor: '#ff0000',
            });
        }
    }
    for (const snake of request.body.board.snakes) {
        let color = '#e74c3c';
        if (snake.id == request.body.you.id) {
            color = '#2ecc71';
        } else if (request.body.you.squad && request.body.you.squad == snake.squad) {
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