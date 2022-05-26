import express from "express";
import {getLog} from "../../../lib/config.js";
import { db, auth } from "../../../lib/firebase.js";
import { ref, get, child } from "firebase/database";
import myDevices from "./my-devices.js";
import { async } from "@firebase/util";


const router = express.Router(),
    Log = getLog("stats");



//Bad Request
router.get('/', (req, res) => {
  const datainf = req;
  const user = auth.user;
  //using this 'user' variable for now.
  get(ref(db, `devices/${datainf.id}`)).then((snapshot) => {
          res.status(400).send({device : req.body, accessToken: req.user.stsTokenManager.accessToken},"Bad Request");
          console.log("Bad Request")
    }).catch((error) => {
      console.error(error);
    });
      
})
 
router.get('/:id', async (req, res) => {
  const datainf = req.params;
  //using this 'user' variable for now.
  const user = req.user;

  const dataId = datainf.id.trim();


  
  try{
    var snapshot = await get(ref(db, `devices/${dataId}`));
    
    if (!snapshot.exists()) {
          res.status(401).send({error : "Unauthorized", accessToken: req.user.stsTokenManager.accessToken});
          Log.info("Unauthorized")
      }
      else if (snapshot.exists() && !snapshot.val().owners.includes(user.uid))
      {
          res.status(401).send({accessToken: req.user.stsTokenManager.accessToken});
          Log.info("Unauthorized");
      }
      // The Device of associated ID exists.
      else if (snapshot.exists() && snapshot.val().owners.includes(user.uid)) {
        var device = snapshot.val();
        var ownersEmails = [];

        for (var owner in device.owners) {
          ownersEmails.push(await get(ref(db, `users/${device.owners[owner]}/credentials/email`)));
        }
        device.owners = ownersEmails;
        res.status(200).send({device, accessToken: req.user.stsTokenManager.accessToken});  
        Log.info(snapshot.val());
      }
      //Internal Server error
      else 
      {
          res.status(500).send({accessToken: req.user.stsTokenManager.accessToken},"Internal server error");
          Log.info("Internal server error")
      }
    } catch(error){
      Log.error(error);
    }    
});

export default {
  router: router
}    



