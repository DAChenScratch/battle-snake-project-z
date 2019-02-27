isFree = (data, x, y, self) => {
    if (x < 0) {
        return false;
    }
    if (y < 0) {
        return false;
    }
    if (x >= data.board.width) {
        return false;
    }
    if (y >= data.board.height) {
        return false;
    }
    for (const snake of data.board.snakes) {
        for (const part of snake.body) {
            if (part.x == x && part.y == y) {
                return false;
            }
        }
        if (snake.id != self.id) {
            if (x >= snake.body[0].x - 1 &&
                x <= snake.body[0].x + 1 &&
                y >= snake.body[0].y - 1 &&
                y <= snake.body[0].y + 1) {
                return false;
            }
        }
    }
    return true;
};
