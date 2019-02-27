"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weight_1 = require("./lib/weight");
const pathfinding_1 = require("pathfinding");
// const colors = ['#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#34495e'];
const grid = $('.grid');
const getCol = (x, y) => {
    return grid.find('.row').eq(y).find('.col').eq(x);
};
const BLOCKED = 1;
const FREE = 0;
const drawBoard = (data) => {
    grid.html('');
    const matrix = [];
    const costs = [];
    for (var y = 0; y < data.board.height; y++) {
        matrix[y] = [];
        costs[y] = [];
        const row = $('<div>').addClass('row').appendTo(grid);
        for (var x = 0; x < data.board.width; x++) {
            const w = weight_1.weight(data, x, y);
            matrix[y][x] = w > 10 ? FREE : BLOCKED;
            costs[y][x] = 100 - w;
            console.log(costs[y][x]);
            const col = $('<div>').addClass('col').css({
                backgroundColor: `rgba(0, 0, 0, ${(100 - w) / 100})`,
            }).appendTo(row);
            $('<div>').addClass('weight').text(w).css({
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
    const pf = new pathfinding_1.default.AStarFinder({
        allowDiagonal: false,
        useCost: true,
    });
    const pfGrid = new pathfinding_1.default.Grid(data.board.width, data.board.height, matrix, costs);
    const path = pf.findPath(data.you.body[0].x, data.you.body[0].y, 0, 0, pfGrid.clone());
    for (const [i, p] of path.entries()) {
        if (i == 0) {
            continue;
        }
        const col = getCol(p[0], p[1]);
        $('<div>').addClass('path').appendTo(col);
    }
    console.log(path);
};
let game = null;
const loadGame = (gameFile) => {
    $('.moves').html('');
    $.getJSON('../games/' + gameFile).done((response) => {
        game = response;
        drawBoard(game.start);
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
$('.game:first').click();
$('.moves').on('click', '.move', function () {
    const turn = $(this).data('turn');
    drawBoard(game.moves[turn]);
});
