import express from "express";
import {auth, sendPasswordResetEmail} from "../../../lib/firebase.js";
import {signInWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import {getLog, addUser} from "../../../lib/config.js";


const router = express.Router(),
    Log = getLog("login");

router.get('/', (req, res) => {
    res.status(200).send("Request received");
})

router.post('/', async (req, res) => {
    const credentials = req.body,
    email = credentials.email.trim(),
    password = credentials.password;

    var code,message;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        addUser(user);

        code = 200;
        message = "Logged in!";
        if(!user.emailVerified){
            sendEmailVerification(user)
            .then(() => {
                Log.info("Verification email has been sent to ", {user : user.email});
                message = "Verify email in order to login";
                code = 401;
                res.status(code).send({error : true, message});
            }).catch((error) => {
                res.status(400).send({error : true, message: "Please verify your email in order to login"});
            });

        } else {
            Log.info("Logged in", {user : user.uid});
            res.status(code).send({error : false, accessToken: user.stsTokenManager.accessToken, message});
        }

    } catch(error) {
         const errorCode = error.code;
         var message;

        if(errorCode == "auth/user-not-found" || "auth/wrong-password" || "auth/invalid-email"){
            code = 400;
            message = "Invalid Credentials";

        } else {
            code = 500;
            message = error.message;
        }
        Log.error("Failed to login", {error, message});
        res.status(code).send({error : true, message});
    }
});


router.put('/', (req, res) => {
    var email = '';

    try {
        email = req.body.email.trim();

    } catch(err) {
        Log.error("Bad request", {error : err.message});
        res.status(400).send({error : true, message : "Bad request", method: "PUT"});
    }

    sendPasswordResetEmail(auth, email)
    .then(() => {
        res.status(200).send({error : false, message: "If the email exists, a password reset email has been sent!"});
    })

    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        
        /**
         * spoof response for email not found
         */
        if(errorCode == "auth/user-not-found"){
            res.status(200).send({error : false, message: "If the email exists, a password reset email has been sent!"});

        } else {
            res.status(400).send({error : true, message: errorMessage});
            Log.error(errorMessage, {error, errorCode});
        }
    })
})

export default {
    router: router
}