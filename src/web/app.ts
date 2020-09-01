import { WebSocketClient } from "./WebSocketClient";
import snakes from "../server/snakes";
import { ISnake } from '../server/snakes/snake-interface';
import { ClientSnake } from '../server/snakes/client-snake';
import { GameManager } from './GameManager';

const app = angular.module('battleSnake', []);

interface RootControllerScope {
    gameManager: GameManager,
    clientSnakes: ClientSnake[],
    autoStart: boolean,
    start: () => void,
    stop: () => void,
    $on: (event: string, callback: () => void) => void,
    $apply: () => void,
    watch: (gameId: string) => void,
    updateAutoStart: () => void,
    percentWins: (wins: number) => void,
}

app.controller('RootController', [
    '$scope',
    function ($scope: RootControllerScope) {
        $scope.gameManager = new GameManager();
        $scope.clientSnakes = snakes.map(s => {
            return new ClientSnake(s, $scope.gameManager);
        });
        $scope.autoStart = localStorage.getItem('autoStart') == 'on';

        let started = null;

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
                snakes: $scope.clientSnakes.filter(s => s.snake.enabled).map(s => s.snake.config),
            };
            console.log(config);
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
                .then(resp => resp.json())
                .then(json => game.id = json.ID)
                .then(_ => fetch(`http://localhost:3005/games/${game.id}/start`, {
                    method: 'POST',
                }))
                .catch(e => console.error(e));
        };

        $scope.start();

        // $scope.$on('end', () => {
        //     if (!started) {
        //         return;
        //     }
        //     for (const game of $scope.games) {
        //         if (!game.finished) {
        //             return;
        //         }
        //     }
        //     if ($scope.autoStart) {
        //         $scope.start();
        //     }
        // });

        $scope.stop = () => {
            started = false;
        };

        $scope.watch = (gameId) => {
            $('#board').attr('src', `http://localhost:3009?engine=http://localhost:3005&game=${gameId}`);
        };

        $scope.updateAutoStart = () => {
            localStorage.setItem('autoStart', $scope.autoStart ? 'on' : 'off');
        };

        $scope.percentWins = (wins) => {
            let sum = 0;
            for (const clientSnake of $scope.clientSnakes) {
                sum += clientSnake.snake.wins;
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