import * as http from "http";
import * as path from "path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv/config";
import { default as logger } from "morgan";
import { default as rfs } from 'rotating-file-stream';
import { default as DBG } from 'debug';
import { approotdir } from "./approotdir.js";
import {
    normalizePort,
    handle404,
    basicErrorHandler,
    onError,
    onListening
} from "./utils/appsupport.js";
import * as handlers from "./controllers/controllers.js"
import { default as verifyToken } from "./middlewares/checkAuth.js"
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.js';

/**
 *  Global Constant variable
 */
const __dirname = approotdir;
const debug = DBG('server:debug');

/**
 *  Initialize the express app object
 */
export const app = express();
export const port = normalizePort(process.env.PORT || '1337');


/**
 *  Initialize the app middlewares
 */
app.set('port', port);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger(process.env.REQUEST_LOG_FORMAT || 'common', {
    stream: process.env.REQUEST_LOG_FILE || 'log.txt' ?
        rfs.createStream(process.env.REQUEST_LOG_FILE || 'log.txt', {
            size: '10M',     // rotate every 10 MegaBytes written
            interval: '1d',  // rotate daily
            compress: 'gzip',  // compress rotated files
            path: path.join(__dirname, 'logs')
        })
        : process.stdout
}));
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup({ ...swaggerDocument }, { explorer: true })
);

/**
 *  Initialize App Routes
 */
app.get('/api/v1/health', handlers.health);
app.post('/api/v1/login', handlers.login);
app.post('/api/v1/jsonpatch', verifyToken, handlers.jsonPatchHandler);
app.post('/api/v1/image', verifyToken, handlers.imageHandler);
// app.post('/api/v1/verify', verifyToken, handlers.health);
// https://d37y9b4kfek2hl.cloudfront.net/blog/images/posts/29/remove-public-path.png


/**
 * Not Found and Error Middleware
 * Error Handlers
 * Catch 404 and forward to error handler
 * @params {Function}
 */
app.use(handle404);
app.use(basicErrorHandler);

export const server = http.createServer(app);
server.listen(port)

server.on('request', (req, res) => {
    debug(`${new Date().toISOString()} request: ${req.method} ${req.url}`);
})
server.on('error', onError);
server.on('listening', onListening);
