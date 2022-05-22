import express from "express";
import config from "../../../lib/config.js";
import { db,auth } from "../../server.js";
import {createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";

const router = express.Router(),
    Log = config.getLog("register");


router.delete('/', async (req, res) => {
    // TODO: add this @fergal
})

router.post('/', async (req, res) => {
    const credentials = req.body.credentials,
    email = credentials.email,
    password = credentials.password,
    address = req.body.address;

    var code, message;
    
    try {
        const userCredential =  await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        req.user = user;
        set(ref(db, `users/${user.uid}`),
            {
                "credentials": {
                    "email": email,
                },
                "address": address   
            }
        );
        code = 200;
        message = "Success"
        res.status(code).send({accessToken : user.stsTokenManager.accessToken});
    } catch(error) {
        const errorCode = error.code;
        var message = {error : ""};

        if(errorCode == "auth/email-already-in-use"){
            code = 400;
            message.error = "Email already in use"
        } else if (errorCode == "auth/weak-password"){
            code = 400;
            message.error = "Weak password: Should be at least 6 characters long"
        } else if(errorCode == "auth/invalid-email"){
            code = 400;
            message.error = "Invalid email"
        } else {
            code = 500;
            message.error = "Internal server error"
        }

        res.status(code).send(message);
    }
}); 


export default {
    router: router
}