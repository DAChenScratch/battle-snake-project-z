<html ng-app="battleSnake" ng-controller="RootController">

<head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <style>
    </style>
</head>

<body ng-cloak>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-5">
                <button ng-click="start()" class="btn btn-primary">Start</button>
                <button ng-click="stop()" class="btn btn-primary">Stop</button>
                <div class="border p-2">
                    <div ng-repeat="snake in snakes">
                        {{ snake.name }} <small>port:</small> {{ snake.port }} <small>wins:</small> {{ snake.wins.length }}
                    </div>
                </div>
                <div ng-repeat="game in games | orderBy: '-moves'">
                    <div class="border p-2">
                        <a ng-click="watch(game.id)" href="#">Watch</a>
                        <small>game:</small> {{ $index + 1 }}
                        <small>moves:</small> {{ game.moves }}
                        <small>winner:</small> {{ game.winner.name }}
                        <div ng-repeat="snake in game.snakes">
                            {{ snake.name }}
                            <div ng-repeat="op in snake.ops track by $index">{{ op }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-7">
                <iframe frameborder="0" id="board" width="100%" height="800px" src="http://localhost:3009"></iframe>
            </div>
        </div>
    </div>


    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.8/angular.js"></script>
    <script src="bundle.js?cache=<?=time();?>"></script>
</body>
</html>
