<html>

<head>
    <style>
        .wrapper {
            display: flex;
        }

        .games,
        .moves {
            padding: 10px;
            flex-direction: column-reverse;
            display: flex;
        }

        .game,
        .move {
            cursor: pointer;
            text-decoration: underline;
            flex: 1;
        }

        .grid {
            width: 600;
            height: 600;
            display: flex;
            flex-direction: column;
        }

        .row {
            display: flex;
            flex: 1;
        }

        .col {
            border-top: 1px dashed #bbb;
            border-left: 1px dashed #bbb;
            display: flex;
            flex-direction: column;
            flex: 1;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .row:last-child .col {
            border-bottom: 1px dashed #bbb;
        }

        .col:last-child {
            border-right: 1px dashed #bbb;
        }

        .food {
            background: #3498db;
            width: 25px;
            height: 25px;
            border-radius: 25px;
            margin: 1px;
        }

        .snake {
            flex: 1;
            width: 100%;
            border: 1px dotted #eee;
        }

        .weight {
            position: absolute;
            top: 11px;
            left: 0;
            right: 0;
            bottom: 0;
            text-align: center;
        }
    </style>
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script src="../lib/gridDistance.js"></script>
    <script src="../lib/log.js"></script>
    <script src="../lib/moveTowardsFood.js"></script>
    <script src="../lib/randomMove.js"></script>
    <script src="../lib/weight.js"></script>
</head>

<body>
    <div class="wrapper">
        <div class="grid">
        </div>
        <div class="games">
            <?php foreach (glob(__DIR__ . '/../games/*.json') as $file): ?>
                <div class="game" data-game="<?= basename($file); ?>"><?= basename($file); ?></div>
            <?php endforeach; ?>
        </div>
        <div class="moves">
        </div>
    </div>
</body>
<script>
    const colors = ['#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#34495e'];
    const grid = $('.grid');

    const getCol = (x, y) => {
        return grid.find('.row').eq(y).find('.col').eq(x);
    };

    const drawBoard = (data) => {
        grid.html('');
        for (var y = 0; y < data.board.height; y++) {
            const row = $('<div>').addClass('row').appendTo(grid);
            for (var x = 0; x < data.board.width; x++) {
                const w = weight(data, x, y);
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
    };

    let game = null;
    const loadGame = (gameFile) => {
        $('.moves').html('');
        $.getJSON('../games/' + gameFile).then((response) => {
            game = response;
            drawBoard(game.start);
            for (const move of game.moves) {
                $('<div>').addClass('move').data('turn', move.turn).text('Move ' + move.turn).appendTo('.moves');
            }
        });
    }

    $('.game').click(function() {
        const gameFile = $(this).data('game');
        loadGame(gameFile);
    });

    $('.game:first').click();

    $('.moves').on('click', '.move', function() {
        const turn = $(this).data('turn');
        drawBoard(game.moves[turn]);
    });
</script>

</html>