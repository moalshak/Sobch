import express from "express";
import config from "../../../lib/config.js";
import { db, auth} from "../../server.js";
import {  signInWithEmailAndPassword } from "firebase/auth";


const router = express.Router(),
    Log = config.getLog("login");

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
        req.user = user;
        code = 200;
        message = "Success - Logged in"
        res.status(code).send({accessToken: user.stsTokenManager.accessToken});
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
        } else{
            code = 500;
            message.error = error.message;
        }
        res.status(code).send(message);
    }
});

export default {
    router: router
}