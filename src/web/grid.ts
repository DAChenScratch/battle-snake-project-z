import { BTData, initBTData } from '../types/BTData';
import snakes from "../server/snakes";
import { invertColor } from '../lib/invertColor';

export function loadGrid() {
    // const colors = ['#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#34495e'];
    const grid = $('.grid');

    const getCol = (x, y) => {
        return grid.find('.row').eq(y).find('.col').eq(x);
    };

    const drawBoard = (data: BTData) => {
        data = initBTData(data);
        const snake = snakes.find(s => s.name == data.you.name);
        console.log(data, snake.move(data));
        $('.log').html('');
        if (data.log) {
            for (const log of data.log) {
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
            path: newUrl,
        }, '', newUrl);
    });
};