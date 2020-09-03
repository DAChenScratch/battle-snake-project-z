import { AngularScope } from '../angular-scope';
import { MoveData, loadGrid } from '../grid';
import { weight } from '../../lib/weight';

interface DebugControllerScope extends AngularScope {
    moveJson: MoveData,
    recomputeWeights: () => void,
}

export const DebugController = [
    '$scope',
    function (
        $scope: DebugControllerScope,
    ) {
        $scope.$watch('moveJson', () => {
            loadGrid($scope.moveJson);
        });

        $scope.recomputeWeights = () => {
            console.log('Recompute weights');
            for (var y = 0; y < $scope.moveJson.body.board.height; y++) {
                for (var x = 0; x < $scope.moveJson.body.board.width; x++) {
                    $scope.moveJson.body.grid[y][x].weight = undefined;
                    weight($scope.moveJson.body, x, y);
                }
            }
            loadGrid($scope.moveJson);
        };
    },
];
