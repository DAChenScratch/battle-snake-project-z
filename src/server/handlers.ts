import { Request, Response } from 'express';

interface HttpError extends Error {
    status: number,
}

const poweredByHandler = (req: Request, res: Response, next: (next?: any) => void) => {
    res.setHeader('X-Powered-By', 'Battlesnake');
    next();
};

const fallbackHandler = (req: Request, res: Response, next: (next?: any) => void) => {
    console.dir(req.baseUrl);
    // Root URL path
    if (req.baseUrl === '') {
        res.status(200);
        return res.send(`
            Battlesnake documentation can be found at
            <a href="https://docs.battlesnake.io">https://docs.battlesnake.io</a>.
        `);
    }

    // Short-circuit favicon requests
    if (req.baseUrl === '/favicon.ico') {
        res.set({ 'Content-Type': 'image/x-icon' });
        res.status(200);
        res.end();
        return next();
    }

    // Reroute all 404 routes to the 404 handler
    const err = new Error() as HttpError;
    err.status = 404;
    return next(err);
};

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
    fallbackHandler,
    notFoundHandler,
    genericErrorHandler,
    poweredByHandler,
};
