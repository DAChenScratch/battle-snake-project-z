import { Request, Response } from 'express';

export interface HttpError extends Error {
    status: number,
}

const notFoundHandler = (err: HttpError, req: Request, res: Response, next: (next?: any) => void) => {
    if (err.status !== 404) {
        return next(err);
    }

    res.status(404);
    return res.send({
        status: 404,
        error: err.message || 'These are not the snakes you\'re looking for',
    });
};

const genericErrorHandler = (err: HttpError, req: Request, res: Response, next: (next?: any) => void) => {
    const statusCode = err.status || 500;
    console.error(err);
    res.status(statusCode);
    return res.send({
        status: statusCode,
        error: err,
    });
};

module.exports = {
    notFoundHandler,
    genericErrorHandler,
};
