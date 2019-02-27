moveTowardsFood = (data) => {
    const closest = {
        food: null,
        distance: 100000,
    };
    if (!data.board.food.length) {
        log('moveTowardsFood', 'no food');
        return;
    }
    for (const food of data.board.food) {
        const distance = gridDistance(data.you.body[0].x, data.you.body[0].y, food.x, food.y);
        if (distance < closest.distance) {
            closest.food = food;
            closest.distance = distance;
        }
    }

    let x, y;
    const directions = [0, 1, 2, 3];
    shuffle(directions);
    while (directions.length > 0) {
        const direction = directions.pop();
        switch (direction) {
            // Up
            case 0:
                x = data.you.body[0].x;
                y = data.you.body[0].y - 1;
                break;

            // Down
            case 1:
                x = data.you.body[0].x;
                y = data.you.body[0].y + 1;
                break;

            // Left
            case 2:
                x = data.you.body[0].x - 1;
                y = data.you.body[0].y;
                break;

            // Right
            case 3:
                x = data.you.body[0].x + 1;
                y = data.you.body[0].y;
                break;
        }
        if (isFree(data, x, y, data.you) && gridDistance(x, y, closest.food.x, closest.food.y) < closest.distance) {
            log('moveTowardsFood', direction, data.you.body[0].x, data.you.body[0].y, closest);
            return direction;
        }
    }
    log('moveTowardsFood', 'no options');
};