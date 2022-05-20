import express from "express";
import config from "../../../lib/config.js";
import { db } from "../../server.js";
import { ref, get, set, child } from "firebase/database";

const router = express.Router(),
    Log = config.getLog("profile");

router.get('/:id', (req, res) => {
    const userdata = req.params;
    console.log(userdata)
        get(ref(db, `users/${userdata.id}`)).then((snapshot) => {
        if (!snapshot.exists()){
            res.status(404).send("Not Found");
            Log.info("ID doesn't exist");
            console.log("Not Found")
        }
        else if (snapshot.exists()) {
            res.status(200).send(snapshot.val());
            Log.info("Profile details returned successfully");
        }
        else {
            res.status(404).send(snapshot.val());
            Log.info("ID doesn't exist");
            console.log("Not Found")
        }
        //todo authorized/unauthorized
    }).catch((error) => {
        console.error(error);
    });    
    
})


router.put('/:id', (req, res) => {
    const userid = req.params;
    const credentials = req.body.credentials;
    const address = req.body.address;
    
    
    console.log(credentials.email)
    if(credentials.email == ""){
        res.status(400).send("Bad Request");
        Log.info("Empty string");
        console.log("Bad Request")
    }
    else{
        set(ref(db, `users/${userid.id}`),
        {
            "credentials": {
            "email": credentials.email,
            "password": credentials.password,
            },
            "address": address
        }).catch((error) => {
            console.error(error);
        });
        res.status(200).send("User information has been updated successfully");
        Log.info("User information updated", credentials);
    } 
       

    //todo : add authentification and other responses
})

export default {
    router: router
}