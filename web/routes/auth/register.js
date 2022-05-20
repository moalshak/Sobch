import express from "express";
import config from "../../../lib/config.js";
import { db,auth } from "../../server.js";
import {createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";

const router = express.Router(),
    Log = config.getLog("register");

router.get('/', (req, res) => {
    res.status(200).send("Request received");
})

router.post('/', async (req, res) => {
    const credentials = req.body.credentials,
    email = credentials.email,
    password = credentials.password,
    address = req.body.address;

    var code, message;
    
    try {
        const userCredential =  await createUserWithEmailAndPassword(auth, email, password);
        // Signed in 
        
        const user = userCredential.user;
        set(ref(db, `users/${user.uid}`),
            {
                "credentials": {
                "email": email,
                },
                "address": address   
            });

        
        code = 200;
        //message = user;
        message = "Success"

        res.status(code).send({accessToken : user.stsTokenManager.accessToken});
        
    } catch(error) {
        const errorCode = error.code;
        const errorMessage = error.message;

    if(errorCode == "auth/email-already-in-use"){
        code = 400;
        message = "Email already in use"
        res.status(code).send(message);

        
     }
     if (errorCode == "auth/weak-password"){
        code = 400;
        message = "Weak password: Should be at least 6 characters long"
        res.status(code).send(message);

     }
     if(errorCode == "auth/invalid-email"){
        code = 400;
        message = "Invalid email"
        res.status(code).send(message);
     }
     else {
        code = 500;
        message = "Internal server error"

        res.status(code).send(message);
     }
    }


    
}); 


export default {
    router: router
}