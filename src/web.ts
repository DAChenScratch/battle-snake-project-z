import { weight } from './lib/weight';
import { closestFood } from './lib/closestFood';
import { BTData } from './types/BTData';
import { sortedFood } from './lib/sortedFood';
const PF = require('pathfinding');

// const colors = ['#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#34495e'];
const grid = $('.grid');

const getCol = (x, y) => {
    return grid.find('.row').eq(y).find('.col').eq(x);
};

const BLOCKED = 1;
const FREE = 0;

const pf = new PF.AStarFinder({
    allowDiagonal: false,
    useCost: true,
});

const drawBoard = (data) => {
    grid.html('');
    const matrix = [];
    const costs = [];
    for (var y = 0; y < data.board.height; y++) {
        matrix[y] = [];
        costs[y] = [];
        const row = $('<div>').addClass('row').appendTo(grid);
        for (var x = 0; x < data.board.width; x++) {
            const w = weight(data, x, y);
            matrix[y][x] = w > 0 ? FREE : BLOCKED;
            costs[y][x] = 100 - w;
            const col = $('<div>').addClass('col').css({
                backgroundColor: `rgba(0, 0, 0, ${(100 - w) / 100})`,
            }).appendTo(row);
            $('<div>').addClass('weight').html(x + '/' + y + '<br/>w:' + w + '<br/>' + (matrix[y][x] == FREE ? 'FREE' : 'BLOCKED') + '<br/>c:' + costs[y][x]).css({
                color: w < 60 ? 'white' : 'black',
            }).appendTo(col);
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

    const sorted = sortedFood(data);
    if (!sorted.length) {
        return;
    }
    closest: for (const closest of sorted) {
        const pfGrid = new PF.Grid(data.board.width, data.board.height, matrix, costs);
        const path = pf.findPath(data.you.body[0].x, data.you.body[0].y, closest.food.x, closest.food.y, pfGrid.clone());
        for (let i = 0; i < path.length; i++) {
            const p = path[i];
            if (i == 0) {
                continue;
            }
            const col = getCol(p[0], p[1]);
            $('<div>').addClass('path').appendTo(col);
        }

        for (let i = 0; i < path.length; i++) {
            const p = path[i];
            if (i === 0) {
                continue;
            }
            if (p[0] == data.you.body[0].x - 1 && p[1] == data.you.body[0].y) {
                // Left
                console.log('moveTowardsFoodPf', p, 'left');
                break closest;
            } else if (p[0] == data.you.body[0].x + 1 && p[1] == data.you.body[0].y) {
                // Right
                console.log('moveTowardsFoodPf', p, 'right');
                break closest;
            } else if (p[0] == data.you.body[0].x && p[1] == data.you.body[0].y - 1) {
                // Up
                console.log('moveTowardsFoodPf', p, 'up');
                break closest;
            } else if (p[0] == data.you.body[0].x && p[1] == data.you.body[0].y + 1) {
                // Down
                console.log('moveTowardsFoodPf', p, 'down');
                break closest;
            } else {
                console.log('moveTowardsFoodPf', p, 'no path');
            }
        }
    }


    // hasWayOut(data, path);
};


const hasWayOut = (data: BTData, path) => {
    const matrix = [];
    const costs = [];
    for (var y = 0; y < data.board.height; y++) {
        matrix[y] = [];
        costs[y] = [];
        for (var x = 0; x < data.board.width; x++) {
            const w = weight(data, x, y);
            matrix[y][x] = w > 0 ? FREE : BLOCKED;
            costs[y][x] = 100 - w;
        }
    }
    for (const [i, p] of path.entries()) {
        matrix[p[1]][p[0]] = BLOCKED;
    }

    const pfGrid = new PF.Grid(data.board.width, data.board.height, matrix, costs);
    for (const food of data.board.food) {
        const wayOutPath = pf.findPath(data.you.body[0].x, data.you.body[0].y, food.x, food.y, pfGrid.clone());
        console.log(wayOutPath);
    }
}

let game = null;
const loadGame = (gameFile, turn = null) => {
    $('.moves').html('');
    $.getJSON('../games/' + gameFile).done((response) => {
        game = response;
        if (turn) {
            drawBoard(game.moves[turn]);
        } else {
            drawBoard(game.start);
        }
        for (const move of game.moves) {
            if (!move || !move.turn) {
                continue;
            }
            $('<div>').addClass('move').data('turn', move.turn).text('Move ' + move.turn).appendTo('.moves');
        }
    }).fail((xhr, textStatus, errorThrown) => {
        $('.log').text(textStatus + ': ' + errorThrown);
        console.error(textStatus, errorThrown);
    });
};

$('.game').click(function () {
    const gameFile = $(this).data('game');
    loadGame(gameFile);
});

const urlParams = new URLSearchParams(window.location.search);
const queryGame = urlParams.get('game');
const queryTurn = urlParams.get('turn');
if (queryGame) {
    loadGame(queryGame, queryTurn);
} else {
    $('.game:last').click();
}

$('.moves').on('click', '.move', function () {
    const turn = $(this).data('turn');
    drawBoard(game.moves[turn]);
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?game=' + game.moves[turn].you.id + '&turn=' + turn;
    window.history.pushState({
        path:newUrl,
    },'',newUrl);
});