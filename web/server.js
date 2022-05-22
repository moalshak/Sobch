import express from 'express';
import cors from 'cors';
import config from '../lib/config.js';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from "firebase-admin/auth";
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
 * - db the database object that will be exported by this file
 * so that it can be used in other files
 * - auth : the auth object that will be exported by this file
 * - admin_auth : the admin auth object that will be exported by this file
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

/**
 * the white listed endpoints (allowed to be accessed without authentication)
 */
const whiteList = [
    "/login",
    "/register"
]

/**
 * retrieve the auth token from the request
 * 
 * @param {express.Request} req the request
 * @returns {string} the auth token
 */
const getAuthToken = (req) => {
    if (req.headers.authorization) {
        return req.headers.authorization;
    }
    return null;
};

/**
 * The middle ware for the server
 *  - If the endpoint is whitelisted then allow access for non logged in / authenticated users
 *  - If the endpoint is not whitelisted then check if the user is logged in / authenticated
 *  - If the user is not logged in / authenticated then send a 401 error
 *  - If the user is logged in / authenticated then send the request to the next middleware
 * 
 * @param {express.Request} req the request
 * @param {express.Response} res the response
 * @param {function} next the next function (what happens after the middleware)
 * 
 * @returns 
 */
const middleWare = async (req, res, next) => {
    const endPoint = "/" + req.url.split("/")[1];
    if (whiteList.includes(endPoint) && req.method !== "DELETE") {
        next();
    } else {
        const authToken = getAuthToken(req);
        if (authToken) {
            try {
                const decodedToken = await admin_auth.verifyIdToken(authToken);
                const uid = decodedToken.uid;
                // if the token is about to expire (1 minute), refresh it
                if (decodedToken.exp - decodedToken.auth_time <= 60) {
                    await admin_auth.revokeRefreshTokens(uid);
                }
                const user = await admin_auth.getUser(uid);
                user.stsTokenManager = {accessToken : authToken};
                req.user = user
                Log.info(`request received on ${req.url}`, {time : new Date().toISOString(), method: `${req.method}`});
                next();
            } catch(err) {
                req.user = null;
                Log.info(`unauthorized request received on ${req.url}`, {time : new Date().toISOString(), method: `${req.method}`});
                return res.status(401).send({ error: 'You are not authorized to make this request', message: err.message });
            }
        } else {
            // if the req.url is not in the routes, then it is not a valid request
            if (!Object.keys(routes).includes(endPoint)) {
                Log.info(`invalid request received on ${req.url}`, {time : new Date().toISOString(), method: `${req.method}`});
                return res.status(400).send({ error: `Invalid request cannot ${req.method} to ${req.url}` });
            } else {
                Log.info(`unauthorized request received on ${req.url}`, {time : new Date().toISOString(), method: `${req.method}`});
                return res.status(401).send({ error: 'You are not authorized to make this request' });
            }
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

