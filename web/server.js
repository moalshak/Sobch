import express from 'express';
import cors from 'cors';
import {PORT, getLog, getUser} from '../lib/config.js';
import {db, auth, admin_auth, app} from '../lib/firebase.js';
import subdomain from 'express-subdomain';

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
import logout from './routes/auth/logout.js';

/**
 * Logger for this js file
 */
const Log = getLog('main');

/**
 * the routes
 *  - an object with the endpoint as key and the js file as value
 */
const routes = {
    "/api" : index,
    "/api/register": register,
    "/api/login": login,
    "/api/logout": logout,
    "/api/profile": profile,
    "/api/my-devices": my_devices,
    "/api/stats": stats,
    "/api/alter": alter
}

/**
 * the white listed endpoints (allowed to be accessed without authentication)
 */
const whiteList = [
    "/api/login",
    "/api/register",
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
    const endPoint = "/" + req.url.split("/")[2];
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    Log.info("Request received", {endPoint, ip});
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
                var user = getUser(uid);
                if (!user.stsTokenManager) {
                    user.stsTokenManager = {};
                }
                user.stsTokenManager.accessToken = authToken;
                req.user = user
                Log.info(`request received on ${req.url}`, {ip, time : new Date().toISOString(), method: `${req.method}`, user: {uid : user.uid, email : user.email}});
                return next();
            } catch(err) {
                req.user = null;
                Log.info(`unauthorized request received on ${req.url}`, {ip, time : new Date().toISOString(), method: `${req.method}`});
                return res.status(401).send({ error: 'You are not authorized to make this request', message: err.message });
            }
        } else {
            // if the req.url is not in the routes, then it is not a valid request
            if (!Object.keys(routes).includes(endPoint)) {
                Log.info(`invalid request received on ${req.url}`, {ip, time : new Date().toISOString(), method: `${req.method}`});
                return res.status(405).send({ error: `Invalid request. cannot ${req.method} to ${req.url}` });
            } else {
                Log.info(`unauthorized request received on ${req.url}`, {ip, time : new Date().toISOString(), method: `${req.method}`});
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
// function initDB() {

//     const serviceAccount = SERVICE_ACCOUNT;
//     const firebaseConfig = FIRE_BASE_CONFIG;
//     // Initialize Firebase
//     app = initializeApp({
//         firebaseConfig,
//         credential: cert(serviceAccount),
//         databaseURL: "https://hip-informatics-307918-default-rtdb.europe-west1.firebasedatabase.app"
//     });

//     admin_auth = getAuth(app);

//     const c_app = c_initializeApp(firebaseConfig);

//     auth = c_getAuth(c_app);

//     // Get a reference to the database service
//     return c_getDatabase(c_app);
// }

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
    
    var router = express.Router();
    app.use(subdomain('api', router));

    app.listen(PORT, () => {
        Log.info(`Server is running on port ${PORT}`, {url : `http://0.0.0.0:${PORT}/`});
    })
}


if (process.argv[2] === 'start') {
    init();
}

/**
 * export the database object so that it can be used in other files
 */
export {
    db as db,
    auth as auth,
    app as app,
    init as init
}

