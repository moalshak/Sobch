import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from "firebase-admin/auth";
import { initializeApp as c_initializeApp} from 'firebase/app';
import { getAuth as c_getAuth} from 'firebase/auth';
import { getDatabase as c_getDatabase } from 'firebase/database';
import {SERVICE_ACCOUNT, FIRE_BASE_CONFIG} from './config.js';

/**
 * - db the database object that will be exported by this file
 * so that it can be used in other files
 * - auth : the auth object that will be exported by this file
 * - admin_auth : the admin auth object that will be exported by this file
 * - app : admin app
 */
 var db, auth, admin_auth, app;


/**
 * initialize the database and connect to it
 * 
 * @returns {firebase.database.Database} Database 
 */
 function initDB() {

    const serviceAccount = SERVICE_ACCOUNT;
    const firebaseConfig = FIRE_BASE_CONFIG;
    // Initialize Firebase
    app = initializeApp({
        firebaseConfig,
        credential: cert(serviceAccount),
        databaseURL: "https://hip-informatics-307918-default-rtdb.europe-west1.firebasedatabase.app"
    });

    admin_auth = getAuth(app);

    const c_app = c_initializeApp(firebaseConfig);

    auth = c_getAuth(c_app);

    // Get a reference to the database service
    return c_getDatabase(c_app);
}

if (!db || !auth || !admin_auth || !app) {
    db = initDB();
}


export  {
    db,
    auth,
    admin_auth,
    app
}