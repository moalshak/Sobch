import express from 'express';
import { initializeApp } from "firebase/app";
import cors from 'cors';
import { getDatabase } from "firebase/database";
import config from '../lib/config.js';

/**
 * the routes
 */
import index from './routes/index.js';
import my_devices from './routes/devices/my-devices.js';
import register from './routes/auth/register.js';
import login from './routes/auth/login.js';
import stats from './routes/devices/stats.js';
import alter from './routes/devices/alter.js';
import profile from './routes/users/profile.js';

/**
 * the port to listen on either specified in the config or the default port 8000
 */
const PORT = config.PORT;

/**
 * Logger for this js file
 */
const Log = config.getLog('main');

/**
 * the database object that will be exported by this file
 * so that it can be used in other files
 */
var db;

/**
 * the routes
 *  - an object with the endpoint as key and the js file as value
 */
const routes = {
    "/" : index,
    "/register": register,
    "/login": login,
    "profile": profile,
    "/my-devices": my_devices,
    "/stats": stats,
    "/alter": alter
}


/**
 * initialize the routes and add them to the server
 * 
 * @param {express.Application} app the express application
 */
function initRoutes(app) {
    for (var route in routes) {
        // add middleware here
        app.use(route, routes[route].router);
    }
}

/**
 * initialize the database and connect to it
 * 
 * @returns {firebase.database.Database} Database 
 */
function initDB() {

    const firebaseConfig = config.FIRE_BASE_CONFIG;
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Get a reference to the database service
    return getDatabase(app);
}

/**
 * initialize the server and start it
 * 
 * - first call express.js to create the server
 * - then call initRoutes to add the routes
 * - then call initDB to initialize the database
 * - then call listen to start the server
 */
function init() {
    const app = express();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cors())

    initRoutes(app);

    db = initDB();

    app.listen(PORT, () => {
        Log.info(`Server is running on port ${PORT}`, {url : `http://localhost:${PORT}/`});
    })
}

init();

/**
 * export the database object so that it can be used in other files
 */
export {
    db as db
}

