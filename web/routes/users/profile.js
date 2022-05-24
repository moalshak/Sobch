import express from "express";
import config from "../../../lib/config.js";
import { db } from "../../server.js";
import { ref, get, set, child } from "firebase/database";
import { updateEmail, updatePassword, updateProfile, verifyBeforeUpdateEmail, sendEmailVerification } from "firebase/auth";

const router = express.Router(),
    Log = config.getLog("profile");

router.get('/:id', (req, res) => {
    //to do : testinggggg
    if (!req.user) {
        return res.status(401).send({error : "Unauthorized access"});
    } else if (req.user.uid !== req.params.id) {
        return res.status(401).send({error : "Unauthorized access"});
    }

    const userid = req.user.uid;
    const meta = req.user.metadata;

    get(ref(db, `users/${userid}`)).then((snapshot) => {
        if (req.user.uid === req.params.id) {
            res.status(200).send({profile: snapshot.val(), accessToken: req.user.stsTokenManager.accessToken, meta});
            Log.info("Profile details returned successfully");
        } else if (!snapshot.exists()){
            res.status(401).send({error : "Unauthorized access"});
        } else {
            res.status(400).send({error : "Bad Request"});
        }
    }).catch((error) => {
        console.error(error);
        res.status(400).send({error : error});
    });        
})


router.put('/:id', (req, res) => {
    //to do : testinggggg
    
    const reqToken = req.user.stsTokenManager.accessToken;
    const userid = req.user.uid;
    const reqid = req.params.id;
    const credentials = req.body.credentials;
    const address = req.body.address;
    const user = req.user;
    const newPassword = credentials.password.trim();
    
    if(req.user.uid !== req.params.id){
        res.status(401).send({error : "Unauthorized access"});
    }
    else if (req.user.uid === req.params.id){
        get(ref(db, `users/${userid}`)).then((snapshot) => {
            if (snapshot.exists()){
                if (newPassword !== ""){                   
                    updatePassword(user, newPassword).then(() => {
                        Log.info("User's password has been succesfully updated")
                        res.status(200).send({message : "User information has been updated successfully",accessToken: req.user.stsTokenManager.accessToken});
                    }).catch((error) => {
                        // An error ocurred
                        // ...
                    });
                }
                if(credentials.email !== ""){
                    updateEmail(user, credentials.email).then(() => {
                        Log.info("User's email has been successfully updated")
                        res.status(200).send({message : "User information has been updated successfully",accessToken: req.user.stsTokenManager.accessToken}); 
                    }).catch((error) => {
                        // An error occurred
                        // ...
                    });
                    sendEmailVerification(user)
                    .then(() => {
                        console.log("verification email has been sent")
                        res.status(200).send({message : "User information has been updated successfully",accessToken: req.user.stsTokenManager.accessToken});
                    }).catch((error) => {
                        // An error occurred
                        // ...
                    });
                }
                set(ref(db, `users/${userid}`),
                {
                    "address": address

                }).then(() => {
                    res.status(200).send({message : "User information has been updated successfully",accessToken: req.user.stsTokenManager.accessToken});
                    Log.info("User information updated")
                }).catch((error) => {
                    console.error(error);
                    res.status(400).send({error : error});
                });

            }
            else {
                res.status(400).send({error : "Bad Request"});
            }
    })
    } else {
        res.status(400).send({error : "Bad Request"});

    }
})

export default {
    router: router
}