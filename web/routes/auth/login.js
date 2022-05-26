import express from "express";
import config from "../../../lib/config.js";
import {db, auth} from "../../../lib/firebase.js";
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
        message = "Success - Logged in"
        if(!user.emailVerified){
            sendEmailVerification(user)
            .then(() => {
                console.log("Verification email has been sent")
                message = "Verify email in order to login"
                code = 401;
                res.status(code).send({message});
            }).catch((error) => {
                console.error(error);
                res.status(400).send({error : error});
            });
        } else {
            Log.info("Logged in", {user : user.uid});
            res.status(code).send({accessToken: user.stsTokenManager.accessToken, message});
        }

    } catch(error) {
         const errorCode = error.code;
         var message = {error : ""}

        if(errorCode == "auth/user-not-found"){
            code = 400;
            message.error = "Invalid Email";
        } else if(errorCode == "auth/wrong-password") {
            code = 400;
            message = "Wrong password"
        } else if(errorCode == "auth/invalid-email"){
            code = 400;
            message = "Invalid email"
        } else {
            code = 500;
            message.error = error.message;
        }
        Log.error("Failed to login", {error, message});
        res.status(code).send(message);
    }
});

export default {
    router: router
}