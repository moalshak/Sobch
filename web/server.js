import express from 'express';
import bodyParser from 'body-parser';
import Config from '../Config/config.js';
import path from 'path';
import {fileURLToPath} from 'url';
import dotenv from 'dotenv';

// // import admin from 'firebase-admin';
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue }  from 'firebase-admin/firestore';

import index from './routes/index.js';
import addDevice from './routes/add-device.js';
import signUp from './routes/sign-up.js';
import login from './routes/login.js';

dotenv.config()

const PORT = process.env.PORT || 3000;
export var GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS;

const Log = Config.getLog('main');

var db;

const routes = {
    "/" : index,
    "/add-device": addDevice,
    "/sign-up": signUp,
    "/login": login
}


function initRoutes(app) {
    for (var route in routes) {
        // add middleware here
        app.use(route, routes[route].router);
    }
}

function initDB() {
    // const firebaseConfig = JSON.parse(Config.firebaseConfig);
    // Initialize Firebase
    // const app = initializeApp(firebaseConfig);

    const serviceAccountJson = JSON.parse(process.env.serviceAccountJson);

    const app = initializeApp({
        credential: cert(serviceAccountJson),
        databaseURL: "https://hip-informatics-307918-default-rtdb.europe-west1.firebasedatabase.app"
    })
    // const auth = getAuth(app);

    return getFirestore();
}

function init() {
    const app = express();

    app.set('view engine', 'ejs');

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    initRoutes(app);

    db = initDB();

    app.listen(PORT, () => {
        Log.info(`Server is running on port ${PORT}`, {url : `http://localhost:${PORT}/`});
    })
}

init();

export {
    db as database
}