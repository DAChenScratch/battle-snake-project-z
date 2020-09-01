import { WebSocketClient } from "./WebSocketClient";
import snakes from "../server/snakes";
import { GameManager } from './GameManager';
import { AngularScope } from './angular-scope';
import { response } from 'express';

const app = angular.module('battleSnake', []);

interface RootControllerScope extends AngularScope {
    gameManager: GameManager,
    webSocketClients: WebSocketClient[],
    options: Options,

    start: () => void,
    stop: () => void,
    watch: (gameId: string) => void,
    updateAutoStart: () => void,
    percentWins: (wins: number) => void,
    getAverageMoves: () => number,
}

interface Options {
    boardWidth: number,
    boardHeight: number,
    startingFood: number,
    foodSpawnTime: number,
    autoStart: boolean,
    enabledSnakes: EnabledSnake,
    orderGames: string,
}

interface EnabledSnake {
    [id: string]: boolean;
}
app.controller('RootController', [
    '$scope',
    function ($scope: RootControllerScope) {
        $scope.gameManager = new GameManager();
        $scope.webSocketClients = snakes.map(snake => {
            return new WebSocketClient(snake, snakes, $scope.gameManager, $scope);
        });
        try {
            $scope.options = JSON.parse(localStorage.getItem('options'));
        } catch (error) {
            console.error('Error parsing local storage options', error, localStorage.getItem('options'));
        }
        if (!$scope.options) {
            $scope.options = {
                boardWidth: 10,
                boardHeight: 10,
                startingFood: 10,
                foodSpawnTime: 10,
                autoStart: false,
                enabledSnakes: {},
                orderGames: '$index',
            };
        }


        let started = null;

        $scope.start = () => {
            started = true;

            const config = {
                width: $scope.options.boardWidth,
                height: $scope.options.boardHeight,
                food: $scope.options.startingFood,
                MaxTurnsToNextFoodSpawn: $scope.options.foodSpawnTime,
                snakes: $scope.webSocketClients
                    .filter(webSocketClient => $scope.options.enabledSnakes[webSocketClient.snake.name])
                    .map(webSocketClient => webSocketClient.snake.config),
            };
            const game = {
                id: null,
                config,
                started: new Date(),
                finished: null,
                start: null,
                moves: 0,
                end: null,
                snakes: [],
            };
            fetch('http://localhost:3005/games', {
                method: 'POST',
                body: JSON.stringify(config)
            })
                .then(response => response.json())
                .then(json => game.id = json.ID)
                .then(_ => fetch(`http://localhost:3005/games/${game.id}/start`, {
                    method: 'POST',
                }))
                .catch(e => console.error(e));
        };

        $scope.start();

        $scope.$on('end', () => {
            if (!started) {
                return;
            }
            for (const game of $scope.gameManager.games) {
                if (!game.finished) {
                    return;
                }
            }
            if ($scope.options.autoStart) {
                $scope.start();
            }
        });

        $scope.stop = () => {
            started = false;
        };

        $scope.watch = (gameId) => {
            $('#board').attr('src', `http://localhost:3009?engine=http://localhost:3005&game=${gameId}`);
        };

        $scope.getAverageMoves = () => {
            return Math.round($scope.gameManager.games.reduce((c, n) => c + n.moves, 0) / $scope.gameManager.games.length);
        };

        $scope.$watch('options', () => {
            localStorage.setItem('options', JSON.stringify($scope.options));
        }, true);

        $scope.percentWins = (wins) => {
            let sum = 0;
            for (const webSocketClient of $scope.webSocketClients) {
                sum += webSocketClient.snake.wins;
            }
            if (sum === 0) {
                return 0;
            }
            return (100 / sum * wins).toFixed(1);
        };

        setInterval(() => {
            $scope.$apply();
        }, 100);
    },
]);

export default app;