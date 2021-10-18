import { port, server } from '../server.js';
import { default as DBG } from 'debug';
import * as util from 'util';
const debug = DBG('server:debug');
const error = DBG('server:error');


async function catchProcessDeath() {
    debug('urk...');
    await server.close();
    process.exit(0);
}

process.on('SIGTERM', catchProcessDeath);
process.on('SIGINT', catchProcessDeath);
process.on('SIGHUP', catchProcessDeath);

process.on('exit', () => { debug('exiting...'); });

process.on('uncaughtException', function(err) {
    console.error(`I've crashed!!! - ${(err.stack || err)}`);
});

process.on('unhandledRejection', (reason, p) => {
    console.error(`Unhandled Rejection at: ${util.inspect(p)} reason:${reason}`);
});

export function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val; }
    if (port >= 0) {
        return port;
    }
    return false;
}

export function onError(err) {
    error(err)
    if (err.syscall !== 'listen') {
        throw err;
    }
    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    switch (err.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw err
    }
}

export function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug(`Server running on ${bind} with address http://localhost:${addr.port}`);
}

export function handle404(req, res) {
    res.status(404)
    res.json({ error: 'Not Found' })
}

export function basicErrorHandler(err, req, res, next) {
    // Defer to built-in error handler if headersSent
    // See: http://expressjs.com/en/guide/error-handling.html
    if (res.headersSent) {
        return next(err)
    }
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ?
        err : {};
    // Error message
    if (err.name === 'JsonWebTokenError') {
        res.status(403)
        res.json({
            message: err.message,
            error: err
        });
    }
    res.status(err.status || 500)
    res.json({
        message: err.message,
        error: err
    });
}
