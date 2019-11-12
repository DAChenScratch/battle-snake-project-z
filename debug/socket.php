<html ng-app="battleSnake" ng-controller="RootController">

<head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <style>
    </style>
</head>

<body ng-cloak>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-4">
                <button ng-click="start()" class="btn btn-primary">Start</button>
                <button ng-click="stop()" class="btn btn-primary">Stop</button>
                <div class="border p-2">
                    <div ng-repeat="snake in snakes">
                        {{ snake.name }} {{ snake.port }}
                    </div>
                </div>
                <div ng-repeat="game in games">
                    <div class="border p-2">
                        <a ng-click="watch(game.id)" href="#">Watch</a>
                        {{ game.id }}
                        moves: {{ game.moves.length }}
                        winner: {{ game.end.board.snakes[0].name }}
                    </div>
                </div>
            </div>

            <div class="col-md-8">
                <iframe frameborder="0" id="board" width="100%" height="800px" src="http://localhost:3009"></iframe>
            </div>
        </div>
    </div>


    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.8/angular.js"></script>
    <script src="bundle.js?cache=<?=time();?>"></script>
</body>
</html>
