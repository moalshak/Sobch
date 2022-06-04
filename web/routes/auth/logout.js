import express from 'express';
import { auth } from '../../../lib/firebase.js';
import { signOut } from 'firebase/auth';
import {removeUser, getLog} from '../../../lib/config.js';


const router = express.Router(),
    Log = getLog("logout");

    /**
<<<<<<< HEAD
     * @api {get} /auth/logout Logout
     */
=======
     * @api {post} /auth/logout Logout
     */

<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> 280e6cc229b10ae2e3b0b50184d0371e79c7a3f6
=======
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
<<<<<<< Updated upstream
>>>>>>> c56e3d46495cf934660db6d8d2b089c08a52fe00
=======
>>>>>>> 8b39a79f56449daaafa61f3273e511f0d566014e
>>>>>>> Stashed changes
=======
>>>>>>> 8b39a79f56449daaafa61f3273e511f0d566014e
>>>>>>> Stashed changes
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
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