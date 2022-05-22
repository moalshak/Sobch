import express from "express";
import config from "../../../lib/config.js";
import { db,auth } from "../../server.js";
import {createUserWithEmailAndPassword, deleteUser, getAuth } from "firebase/auth";
import { ref, set } from "firebase/database";

const router = express.Router(),
    Log = config.getLog("register");


router.delete('/', async (req, res) => {

    const user = auth.currentUser ;
    var message, code;
    

    try{
        deleteUser(user);
        code = 200;
        message = "Success"   

        set(ref(db, `users/${user.uid}`), null),
        res.status(200).send(`Account Nuked`);
        Log.info(`Success - Account deleted`);
    

    } catch (error){
        code = 400;
        message = "FAILED"
        res.status(code).send({message});
    }

   
});

router.post('/', async (req, res) => {
    const credentials = req.body.credentials,
    email = credentials.email.trim(),
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