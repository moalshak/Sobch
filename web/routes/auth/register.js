import express from "express";
import {getLog, addUser, getUser} from "../../../lib/config.js";
import { db,auth } from "../../server.js";
import {createUserWithEmailAndPassword, deleteUser, getAuth, sendEmailVerification } from "firebase/auth";
import { ref, set } from "firebase/database";

const router = express.Router(),
    Log = getLog("register");


/**
 * @api {delete} /auth/register Register
 * request to delete account
 */

router.delete('/', async (req, res) => {
    const user = req.user;
    var message, code;
    
    try{
        deleteUser(user);
        code = 200;
        message = "Success"   

        set(ref(db, `users/${user.uid}`), null),
        res.status(200).send({error : false, message : `Account Nuked`});
        Log.info(`Success - Account deleted`);

    } catch (error){
        code = 400;
        message = "FAILED"
        res.status(code).send({message});
    }
});

/**
<<<<<<< HEAD
 * @api {post} /auth/register Register
 * request to register account
 */

router.post('/', async (req, res) => {
    const credentials = req.body.credentials,
        email = credentials.email.trim(),
        password = credentials.password,
        address = req.body.address;

    var code, message;
    
    try {
        const userCredential =  await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        addUser(user);

        set(ref(db, `users/${user.uid}`),
            {
                "credentials": {
                    "email": email,
                },
                "address": address   
            }
        );

        sendEmailVerification(user)
        .then(() => {
            Log.info(`Success - Verification email sent`, {user : user.uid});
        }).catch((error) => {
            Log.error(error);
            res.status(400).send({error : true, message: "Please verify your email in order to login"});
        });

        code = 200;
        message = "Success, please make sure to verify your email in order to login"
        res.status(code).send({message, accessToken : user.stsTokenManager.accessToken});

    } catch(error) {
        const errorCode = error.code;
        var message;

        if(errorCode == "auth/email-already-in-use"){
            code = 200;
            message = "Email already in use";
        } else if (errorCode == "auth/weak-password"){
            code = 200;
            message = "Weak password: Should be at least 6 characters long";
        } else if(errorCode == "auth/invalid-email"){
            code = 200;
            message = "Invalid email";
        } else {
            code = 500;
            message = "Internal server error";
        }
        Log.error(error);
        res.status(code).send({error : true, message});
    }
}); 


export default {
    router: router
}