import express from 'express';
import cors from 'cors';
import config from '../lib/config.js';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import { initializeApp as c_initializeApp} from 'firebase/app';
import { getAuth as c_getAuth} from 'firebase/auth';
import { getDatabase as c_getDatabase } from 'firebase/database';

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
var db, auth, admin_auth;

/**
 * the routes
 *  - an object with the endpoint as key and the js file as value
 */
const routes = {
    "/" : index,
    "/register": register,
    "/login": login,
    "/profile": profile,
    "/my-devices": my_devices,
    "/stats": stats,
    "/alter": alter
}

const whiteList = [
    "/login",
    "/register"
]

const getAuthToken = (req) => {
    if (req.headers.authorization) {
        return req.headers.authorization;
    }
    return null;
};


const middleWare = (req, res, next) => {
    if (whiteList.includes(req.url)) {
        next();
    } else {
        const authToken = getAuthToken(req);
        if (authToken) {
            admin_auth.verifyIdToken(authToken)
                .then((decodedToken) => {
                    console.log(decodedToken)
                    const uid = decodedToken.uid;
                    Log.info(`request received on ${req.url}`, {time : new Date().toISOString(), method: `${req.method}`});
                    next();
                })
                .catch((err) => {
                    console.log(err);
                    Log.info(`unauthorized request received on ${req.url}`, {time : new Date().toISOString(), method: `${req.method}`});
                    return res.status(401).send({ error: 'You are not authorized to make this request', message: err.message });
                });
        } else {
            Log.info(`unauthorized request received on ${req.url}`, {time : new Date().toISOString(), method: `${req.method}`});
            return res.status(401).send({ error: 'You are not authorized to make this request', message: err.message });
        }
    }
};

/**
 * initialize the routes and add them to the server
 * 
 * @param {express.Application} app the express application
 */
function initRoutes(app) {
    app.use(middleWare);
    for (var route in routes) {
        app.use(route, routes[route].router);
    }
}

/**
 * initialize the database and connect to it
 * 
 * @returns {firebase.database.Database} Database 
 */
function initDB() {

    const serviceAccount = config.SERVICE_ACCOUNT;
    const firebaseConfig = config.FIRE_BASE_CONFIG
    // Initialize Firebase
    const app = initializeApp({
        firebaseConfig,
        credential: cert(serviceAccount),
        databaseURL: "https://hip-informatics-307918-default-rtdb.europe-west1.firebasedatabase.app"
    });

    admin_auth = getAuth(app);

    const c_app = c_initializeApp(firebaseConfig);

    // const app = initializeApp(firebaseConfig);
    auth = c_getAuth(c_app);

    // Get a reference to the database service
    return c_getDatabase(c_app);
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
    db as db,
    auth as auth
}

