<html ng-app="battleSnake" ng-controller="RootController">

<head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
</head>

<body ng-cloak>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-5">
                <div class="form-group">
                    <label for="boardWidth">Board width</label>
                    <input type="number" step="1" class="form-control" id="boardWidth" ng-model="options.boardWidth" />
                </div>
                <div class="form-group">
                    <label for="boardHeight">Board height</label>
                    <input type="number" step="1" class="form-control" id="boardHeight" ng-model="options.boardHeight" />
                </div>
                <div class="form-group">
                    <label for="startingFood">Starting food</label>
                    <input type="number" step="1" class="form-control" id="startingFood" ng-model="options.startingFood" />
                </div>
                <div class="form-group">
                    <label for="foodSpawnTime">Max turns to food spawn</label>
                    <input type="number" step="1" class="form-control" id="foodSpawnTime" ng-model="options.foodSpawnTime" />
                </div>
                <div class="form-group">
                    <button ng-click="start()" class="btn btn-primary">Start</button>
                    <button ng-click="stop()" class="btn btn-primary">Stop</button>
                    <input type="checkbox" ng-model="options.autoStart" /> Auto Start
                </div>

                <div class="form-group border p-2">
                    <div ng-repeat="webSocketClient in webSocketClients | orderBy: '-snake.wins.length'">
                        <input type="checkbox" ng-model="options.enabledSnakes[webSocketClient.snake.name]" />
                        {{ webSocketClient.snake.name }} <small>port:</small> {{ webSocketClient.snake.port }} <small>wins:</small> {{ webSocketClient.snake.wins }} {{ percentWins(webSocketClient.snake.wins) }}%
                    </div>
                </div>

                <div class="form-group">
                    Sort by:
                    <!-- <button ng-click="start()" class="btn btn-sm btn-primary">Wins</button> -->
                    <button ng-click="options.orderGames = 'index'" class="btn btn-sm btn-primary">First</button>
                    <button ng-click="options.orderGames = '-finished.getTime()'" class="btn btn-sm btn-primary">Recent</button>
                    <button ng-click="options.orderGames = '-moves'" class="btn btn-sm btn-primary">Moves</button>
                </div>

                <div>
                    Average moves {{ getAverageMoves() }}
                </div>
                <table class="table table-striped table-sm border">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Game</th>
                            <th>Moves</th>
                            <th>Finished</th>
                            <th>Winner</th>
                            <th>Snakes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="game in gameManager.games | orderBy: options.orderGames">
                            <td><button ng-click="watch(game.id)" class="btn btn-sm btn-primary">Watch</button></td>
                            <td>{{ game.index + 1 }}</td>
                            <td>{{ game.moves }}</td>
                            <td>{{ game.finished | date: 'mediumTime' }}</td>
                            <td>{{ game.winner.name }}</td>
                            <td>
                                <div ng-repeat="snake in game.snakes">
                                    <b>{{ snake.name }}</b>
                                    <small>{{ snake }}</small>
                                    <div ng-repeat="op in snake.ops track by $index">{{ op }}</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="col-md-7">
                <iframe frameborder="0" id="board" width="100%" height="800px" src="http://localhost:3009"></iframe>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.0/angular.js"></script>
    <script src="bundle.js?cache=<?= time(); ?>"></script>
</body>

</html>