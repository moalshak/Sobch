import express from "express";
import config from "../../../lib/config.js";
import { db, auth} from "../../server.js";
import {  signInWithEmailAndPassword } from "firebase/auth";

<<<<<<< HEAD
=======


>>>>>>> 1cdc3b667838e318c8f6b73e81264c25aa671966
const router = express.Router(),
    Log = config.getLog("login");

router.get('/', (req, res) => {
    res.status(200).send("Request received");
})

router.post('/', async (req, res) => {
    const credentials = req.body,
    email = credentials.email,
    password = credentials.password;

    var code,message;

<<<<<<< HEAD
    try {

=======

     try {
       
>>>>>>> 1cdc3b667838e318c8f6b73e81264c25aa671966
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        const user = userCredential.user;
        req.user = user;

        code = 200;
        //message = user;
        message = "Success - Logged in"
        res.status(code).send(message);
        
        
        
    } catch(error) {
         const errorCode = error.code;
         const errorMessage = error.message;
         
         if(errorCode == "auth/user-not-found"){
            code = 400;
            message = "Invalid Email";
            res.status(code).send(message);
            

         }

         if(errorCode == "auth/wrong-password") {
             code = 400;
             message = "Wrong password"
             res.status(code).send(message);
         }

         if(errorCode == "auth/invalid-email"){
            code = 400;
            message = "Invalid email"
            res.status(code).send(message);
         }

         else{
            code = 500;
            
    
            res.status(code).send(message);
         }
        
        
    }
});

export default {
    router: router
}