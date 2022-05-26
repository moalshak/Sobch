import express from 'express';
import { auth } from '../../../lib/firebase.js';
import { signOut } from 'firebase/auth';
import {removeUser, getLog} from '../../../lib/config.js';


const router = express.Router(),
    Log = getLog("logout");

router.post('/', async (req, res) => {
    const user = req.user;

    try {
        auth.currentUser = user;
        removeUser(user);
        await signOut(auth);
        res.status(200).send("Success");
        Log.info("Logged out", {user : user.uid});
    } catch (error) {
        Log.error("Failed to log out", {user : user.uid, error});
        res.status(500).send(error);
    }
});


export default {
    router: router
}