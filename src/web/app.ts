import { WebSocketClient } from "./WebSocketClient";
import snakes from "../server/snakes";

console.log('Init angular app');

const app = angular.module('battleSnake', []);

app.controller('RootController', [
    '$scope',
    function ($scope) {
        $scope.snakes = [];
        $scope.games = [];

        let started = null;
        const clients = [];
        const snakeConfig = [];
        for (const port in snakes) {
            const client = new WebSocketClient($scope, parseInt(port));
            clients.push(client);
            snakeConfig.push({
                name: snakes[port].name,
                url: `http://localhost:${port}/`,
            })
        }

        const width = 10;
        const height = 10;
        const food = 10;
        const MaxTurnsToNextFoodSpawn = 10;
        $scope.start = () => {
            started = true;

            const config = {
                width,
                height,
                food,
                MaxTurnsToNextFoodSpawn,
                snakes: snakeConfig,
            };
            const game = {
                id: null,
                config,
                started: new Date(),
                finished: null,
                start: null,
                moves: [],
                end: null,
            };
            $scope.games.push(game);
            fetch('http://localhost:3005/games', {
                method: 'POST',
                body: JSON.stringify(config)
            })
                .then(resp => resp.json())
                .then(json => game.id = json.ID)
                .then(_ => fetch(`http://localhost:3005/games/${game.id}/start`, {
                    method: 'POST',
                }))
                .catch(e => console.error(e));
        };
        $scope.start();

        $scope.$on('end', function(event, args) {
            if (!started) {
                return;
            }
            for (const game of $scope.games) {
                if (!game.finished) {
                    return;
                }
            }
            $scope.start();
        });

        $scope.stop = () => {
            started = false;
        };

        $scope.watch = (gameId) => {
            $('#board').attr('src', `http://localhost:3009?engine=http://localhost:3005&game=${gameId}`);
        };
    },
]);

export default app;