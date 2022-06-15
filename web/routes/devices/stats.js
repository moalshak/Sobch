import express from "express";
import {getLog, isAdmin} from "../../../lib/config.js";
import {db} from "../../../lib/firebase.js";
import {get, ref} from "firebase/database";


const router = express.Router(),
    Log = getLog("stats");


router.get('/:id', async (req, res) => {
  const devInf = req.params;
  //using this 'user' variable for now.
  const user = req.user;

  const dataId = devInf.id.trim();

  try{
    let snapshot = await get(ref(db, `devices/${dataId}`));
    
    if (!snapshot.exists()) {
          res.status(401).send({error : "Unauthorized", accessToken: req.user.stsTokenManager.accessToken});
          Log.info("Unauthorized")
      }
      else if (snapshot.exists() && !isAdmin(user.uid) &&  !snapshot.val().owners.includes(user.uid))
      {
          res.status(401).send({accessToken: req.user.stsTokenManager.accessToken});
          Log.info("Unauthorized");
      }
      // The Device of associated ID exists.
      else if ((snapshot.exists() && snapshot.val().owners.includes(user.uid)) || isAdmin(user.uid)) {
        let device = snapshot.val();
        let ownersEmails = [];
        if (isAdmin(user.uid)) {
          ownersEmails.push(await get(ref(db, `users/${user.uid}/credentials/email`)));
        }
        for (let owner in device.owners) {
          if (isAdmin(device.owners[owner])) {
            if (isAdmin(user.uid)) {
              if (!ownersEmails.includes(device.owners[owner])) {
                ownersEmails.push(await get(ref(db, `users/${device.owners[owner]}/credentials/email`)));
              }
            }
          } else {
            if (!ownersEmails.includes(device.owners[owner])) {
              ownersEmails.push(await get(ref(db, `users/${device.owners[owner]}/credentials/email`)));
            }
          }
        }
        device.owners = ownersEmails;
        
        // remove all ids except the user.uid from the device.config.wantsToBeNotified
        if (device.config.wantsToBeNotified !== undefined) {
          device.config.wantsToBeNotified = device.config.wantsToBeNotified.includes(user.uid);
        }
        res.status(200).send({device, accessToken: req.user.stsTokenManager.accessToken});  
        Log.info(snapshot.val());
      }
      //Internal Server error
      else  {
          res.status(500).send({accessToken: req.user.stsTokenManager.accessToken, message: "Internal server error"});
          Log.info("Internal server error")
      }
    } catch(error){
      Log.error(error);
      res.status(500).send({accessToken: req.user.stsTokenManager.accessToken, message: "Internal server error"});
    }    
});

export default {
  router: router
}    