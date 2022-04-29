import express from 'express';
import bodyParser from 'body-parser';
import Config from '../Config/Config.js';
import path from 'path';
import {fileURLToPath} from 'url';
import expressLayout from 'express-ejs-layouts';
import mongoose from 'mongoose';

import index from './routes/index.js';

const PORT = process.env.PORT || 8080;

const Log = Config.getLog('main');


const routes = {
    '/' : index
}

function initFolders(app) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    app.set('views', __dirname + '/views');
    // set layouts
    app.set('layout', 'layouts/layout');
    app.use(expressLayout);

    app.use(express.static(path.join(__dirname + '/public')));
}


function initRoutes(app) {
    for (var route in routes) {
        // add middleware here
        app.use(route, routes[route].router);
    }
}

function initDB() {
    const dbUrl = 'mongodb://localhost/mybrary';
    mongoose.connect(dbUrl);
    const db = mongoose.connection;
    db.on('error', () => Log.error('Error connecting to database'));
    db.once('open', () => Log.info('Connected to database', {url : dbUrl}));
}

function init() {
    const app = express();

    app.set('view engine', 'ejs');

    app.use(express.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    initFolders(app);
    initRoutes(app);

    initDB();

    app.listen(PORT, () => {
        Log.info(`Server is running on port ${PORT}`, {url : `http://localhost:${PORT}/`});
    })
}

init();