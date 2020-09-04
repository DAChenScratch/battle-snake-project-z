import { AngularScope } from '../angular-scope';
import { loadGrid } from '../grid';
import { weight } from '../../lib/weight';
import { BTRequest } from '../../types/BTData';

interface DebugControllerScope extends AngularScope {
    request: BTRequest,
    recomputeWeights: () => void,
}

export const DebugController = [
    '$scope',
    function (
        $scope: DebugControllerScope,
    ) {
        $scope.$watch('request', () => {
            loadGrid($scope.request);
        });

        $scope.recomputeWeights = () => {
            console.log('Recompute weights');
            for (var y = 0; y < $scope.request.body.board.height; y++) {
                for (var x = 0; x < $scope.request.body.board.width; x++) {
                    $scope.request.grid[y][x].weight = undefined;
                    weight($scope.request, x, y);
                }
            }
            loadGrid($scope.request);
        };
    },
];
