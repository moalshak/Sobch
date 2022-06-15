import * as server from '../web/server.js';
import assert from 'assert';
import {describe, it} from 'mocha';
import axios from 'axios';
import {get, ref, set} from "firebase/database";
import {db} from "../lib/firebase.js";
import {ACC_PASSWORD, ACC_PASSWORD2, PASSWORD, PORT, TEST_PASSWORD, WEAK_PASSWORD} from '../lib/config.js';


let accessToken, registerAcc, accessToken2;
const USERID = 'VfULdqBkeYXXtjP0xK6lVvYQTIW2', 
    SELIM_ID = 'cKJS6IQrayM9EUt4Zb7IFgHVjBC3',
    deviceID = 31,
    otp = "PYFL-TUVB-MGEE-SYIP";

/**
 * server test
 */

describe('Server can start', () => {
    it('running init', (done) =>{
        server.init();
        done();
    });

    it('nonexistent endpoint returns error', (done) => {
        axios.get(`http://localhost:${PORT}/api/nonexistent`)
        .then((res) => {
            assert.equal(res.status, 405);
            done(res);
        }).catch((err) => {
            assert.equal(err.response.status, 405);
            done();
        })

    })
});

/**
 * login test for each response
 */

describe('login endpoint', () => {
    it('invalid password responds with status 400', (done) => {
        axios.post(`http://localhost:${PORT}/api/login`, {
            email: "mo.alshakoush@gmail.com",
            password: PASSWORD
        }).then((res) => {
            assert.equal(res.status, 400);
            done();
        }).catch((err) => {
            if (err.response.status === 400 && err.response.data.error === true && err.response.data.message === "Invalid Credentials") {
                done();
            } else {
                done(err);
            }
        })
    });



    it('invalid email responds with status 400', (done) => {
        axios.post(`http://localhost:${PORT}/api/login`, {
            email: "mo@gmail.com",
            password: ACC_PASSWORD
        }).then((res) => {
            assert.equal(res.status, 400);
            done();
        }).catch((err) => {
            assert.equal(err.response.status, 400);
            assert.equal(err.response.data.error, true);
            assert.equal(err.response.data.message, "Invalid Credentials");
            done();
        })
    });

    it('test request', (done) => {
        axios.get(`http://localhost:${PORT}/api/login`, {
        
        }).then((res) => {
            assert.equal(res.status, 200);
            done();
        }).catch((err) => {
            done();
        })
    });

    it('valid credentials responds with status 200', (done) => {
        axios.post(`http://localhost:${PORT}/api/login`, {
            email: "mo.alshakoush@gmail.com",
            password: ACC_PASSWORD
        }).then((res) => {
            assert.equal(res.status, 200);
            assert.equal(res.data.error, false);
            assert.equal(res.data.message, "Logged in!");
            accessToken = res.data.accessToken; // set the accesstoken for later use
            done();
        }).catch((err) => {
            done(err);
        })
    });

    it('user forgot password 200', (done) => {
        axios.put(`http://localhost:${PORT}/api/login`, {
            email: "testendpoint@gmail.com"
        }).then((res) => {
            assert.equal(res.status, 200);
            assert.equal(res.data.error, false);
            assert.equal(res.data.message, "If the email exists, a password reset email has been sent!");
            done();
        }).catch((err) => {
            done(err);
        })
    });

    it('non-admins can also login', (done) => {
        axios.post(`http://localhost:${PORT}/api/login`, {
            email: "s.el.sayed.aly@student.rug.nl",
            password: ACC_PASSWORD2
        }).then((res) => {
            assert.equal(res.status, 200);
            assert.equal(res.data.error, false);
            assert.equal(res.data.message, "Logged in!");
            accessToken2 = res.data.accessToken; // set the accesstoken for later use
            done();
        }).catch((err) => {
            done(err);
        })
    });
});

/**
 * Test the register endpoint
 */
 describe('register endpoint', () => {
    it('register endpoint works', (done) => {
        axios.post(`http://localhost:${PORT}/api/register`, {
           credentials:{
                email: "testendpoint@test.com",
                password: TEST_PASSWORD
           },
            address: "testendpoint"
        }).then((res) => {
            assert.equal(res.status, 200);
            assert.equal(res.data.message, "Success, please make sure to verify your email in order to login");            registerAcc = res.data.accessToken;
            done();
        }
        ).catch((err) => {
            done(err);
        });
    });

    it('email already in use', (done) => {
        axios.post(`http://localhost:${PORT}/api/register`, {
            credentials:{
                 email: "f.j.mccollam@student.rug.nl",
                 password: TEST_PASSWORD
            },
        }).then((res) => {
            assert.equal(res.status, 200);
            assert.equal(res.data.message, "Email already in use");
            done();
        }).catch((err) => {
            assert.equal(err.response.status, 400);
            assert.equal(err.response.data.error, true);
            assert.equal(err.response.data.message, "Invalid Credentials");
            done();
        })
    });

    it('weak password', (done) => {
        axios.post(`http://localhost:${PORT}/api/register`, {
            credentials:{
                 email: "f.j.mccollam@student.rug.nl",
                 password: WEAK_PASSWORD
            },
        }).then((res) => {
            assert.equal(res.status, 200);
            assert.equal(res.data.message, "Weak password: Should be at least 6 characters long");
            done();
        }).catch((err) => {
            assert.equal(err.response.status, 400);
            assert.equal(err.response.data.error, true);
            assert.equal(err.response.data.message, "Invalid Credentials");
            done();
        })
    });

    it('invalid email', (done) => {
        axios.post(`http://localhost:${PORT}/api/register`, {
            credentials:{
                 email: "notemail",
                 password: WEAK_PASSWORD
            },
        }).then((res) => {
            assert.equal(res.status, 200);
            assert.equal(res.data.message, "Invalid email");
            done();
        }).catch((err) => {
            assert.equal(err.response.status, 400);
            assert.equal(err.response.data.error, true);
            assert.equal(err.response.data.message, "Invalid Credentials");
            done();
        })
    });
});

/**
 * test delete request in register endpoint
 */ 
 describe('login endpoint for account delete', () => {
    it('valid credentials responds with status 200', (done) => {
        axios.post(`http://localhost:${PORT}/api/login`, {
            email: "testendpoint@test.com",
            password: TEST_PASSWORD
        }).then((res) => {
            assert.equal(res.status, 200);
            assert.equal(res.data.error, false);
            assert.equal(res.data.message, "Logged in!");
            registerAcc = res.data.accessToken; // set the accesstoken for later use
            done();
        }).catch((err) => {
            done(err);
        })
    });
    
    it('delete account works', (done) => {
        axios.delete(`http://localhost:${PORT}/api/register`, {
            headers: {
                Authorization: `${registerAcc}`
            }
        }).then((res) => {
            assert.equal(res.status, 200);
            done();
        }).catch((err) => {
            done(err);
        });
    });
    
});

/**
 * devices test for linking accessing devices
 */

describe('My devices endpoint', () => {
    it('User cannot link a device with an invalid OTP', (done) => {
        axios.post(`http://localhost:${PORT}/api/my-devices`, {
            "device": {
                "id": "31",
                "config": {
                    "min": -22,
                    "max": 80,
                    "room": "bedroom",
                    "active": true
                },
                "otp": "miss"
            },
        },
        {
        headers: {
            Authorization: `${accessToken2}`
        }
        }).then((res) => {
            assert.equal(res.status, 403);
            done(res);
        }).catch((err)=>{
            assert.equal(err.response.status, 403);
            assert.equal(err.response.data.error, true);
            assert.equal(err.response.data.message, "Invalid match (device id / otp)");
            done();
        })
    })
    
    it ('User can link Device' , (done) => {
        axios.post(`http://localhost:${PORT}/api/my-devices`, {
            "device": {
                "id": "31",
                "config": {
                    "min": -22,
                    "max": 80,
                    "room": "bedroom",
                    "active": true
                },
                "otp": "PYFL-TUVB-MGEE-SYIP"
            },
        },
        {
        headers: {
            Authorization: `${accessToken2}`
        }
        }).then((res) => {
            assert.equal(res.status, 200);
            assert.equal(res.data.error, false);
            assert.equal(res.data.message, "device added");
            done();
        }).catch((err) => {
            done(err);
        });
    });
    
    it ('user can get his devices', (done) => {
        axios.get(`http://localhost:${PORT}/api/my-devices`, {
            headers: {
                Authorization: `${accessToken2}`
            }
        }).then((res) => {
            assert.equal(res.status, 200);
            /**
             * make sure that the owners list of every device includes the user id
             */
            res.data.devices.forEach((device) => {
                assert(device.owners.includes(`${SELIM_ID}`));
            });

            /**
             * assert that the user is also linked to the devices
             */
            get(ref(db, `users/${SELIM_ID}`))
            .then((snapshot) => {
                let user = snapshot.val();
                user.owns.forEach((device) => {
                    assert(res.data.devices.some((dev) => dev.id === device));
                });
                done();
            })
        }).catch((err) => {
            done(err);
        });
    });

    it('linking an owned devices updates the config', (done) => {
        axios.post(`http://localhost:${PORT}/api/my-devices`, {
            "device": {
                "id": "31",
                "config": {
                    "min": -22,
                    "max": 80,
                    "room": "bedroom",
                    "active": true
                },
                "otp": "PYFL-TUVB-MGEE-SYIP"
            },
        },
        {
        headers: {
            Authorization: `${accessToken2}`
        }
        }).then((res) => {
            assert.equal(res.status, 200);
            assert.equal(res.data.error, false);
            assert.equal(res.data.message, "Already Owned");
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it('having no devices should not be an issue', (done) => {
        axios.get(`http://localhost:${PORT}/api/my-devices`, {
            headers: {
                Authorization: `${registerAcc}`
            }
        }).then((res) => {
            assert.equal(res.status, 200);
            assert.equal(res.data.message, "No devices to show.");
            done();
        }).catch((err) => {
            done(err);
        });
    })

});

/**
 * test for editing device and their responses
 */
describe('Edit a device endpoint', () => {
    it('Invalid body request responds with 400', (done) => {
        axios.put(`http://localhost:${PORT}/api/alter/${deviceID}`, {
            
        }, {
            headers: {
                Authorization: `${accessToken2}`
            }
        }).then((res) => {
            assert.equal(res.status, 400);
            done();
        }).catch((err) => {
            assert.equal(err.response.status, 400);
            assert.equal(err.response.data.error, "Bad Request");
            done();
        })
    });

    
    it ('user can alter his chosen device', (done) => {
        axios.put(`http://localhost:${PORT}/api/alter/${deviceID}`, {
            device: {
                id: deviceID,
                config: {
                    "min": 15,
                    "max":25,
                    "room": "somewhere man",
                    "active": false
                },
                otp: otp
            }
        }, {
            headers: {
                Authorization: `${accessToken2}`
            }
        }).then((res) => {
            assert.equal(res.status, 200);

            get(ref(db, `devices/${deviceID}`)).then((snapshot) => {
                console.log("1");
                let device = snapshot.val();
                assert.equal(device.config.min, 15);
                assert.equal(device.config.max, 25);
                assert.equal(device.config.room, "somewhere man");
                assert.equal(device.config.active, false);
                done();
            });
        }).catch((err) => {
            console.log(err);
            done(err);
        });
    });

    it ('device.config.active is undefined should work', (done) => {
        axios.put(`http://localhost:${PORT}/api/alter/${deviceID}`, {
            device: {
                id: deviceID,
                config: {
                    "min": 15,
                    "max":25,
                    "room": "somewhere man",
                },
                otp: otp
            }
        }, {
            headers: {
                Authorization: `${accessToken2}`
            }
        }).then((res) => {
            assert.equal(res.status, 200);

            get(ref(db, `devices/${deviceID}`)).then((snapshot) => {
                console.log("1");
                let device = snapshot.val();
                assert.equal(device.config.min, 15);
                assert.equal(device.config.max, 25);
                assert.equal(device.config.room, "somewhere man");
                assert.equal(device.config.active, false);
                done();
            });
        }).catch((err) => {
            console.log(err);
            done(err);
        });
    });

    it ('user cannot alter a device that they do not own', (done) => {
        axios.put(`http://localhost:${PORT}/api/alter/33`, {
            device: {
                id : '33',
                otp : 'anyotp'
            }
        }, {
            headers: {
                Authorization: `${accessToken2}`
            }
        }).then((res) => {
            assert.equal(res.status, 401);
            done();
        }).catch((err) => {
            if (err.response.status === 401 && err.response.data.message === "Unauthorized") {
                done();
            } else {
                done(err);
            }
        });
    });

    it ('user cannot alter a device that does not exist', (done) => {
        axios.put(`http://localhost:${PORT}/api/alter/0`, {
            device: {
                id : 0,
                otp : 3
            }
        }, {
            headers: {
                Authorization: `${accessToken2}`
            }
        }).then((res) => {
            assert.equal(res.status, 401);
            done();
        }).catch((err) => {
            if (err.response.status === 401 && err.response.data.message === "Unauthorized") {
                done();
            } else {
                done(err);
            }
        });
    });

    it ('user cannot alter a device with incorrect / unmatching credentials', (done) => {
        axios.post(`http://localhost:${PORT}/api/my-devices`, {
            device: {
                id : 0,
                otp : 3
            }
        }, {
            headers: {
                Authorization: `${accessToken2}`
            }
        }).then((res) => {
            assert.equal(res.status, 403);
            done();
        }).catch((err) => {
            if (err.response.status === 403 && err.response.data.error === true && err.response.data.message === "Invalid match (device id / otp)") {
                done();
            } else {
                done(err);
            }
        });
    });

    it ('Wrong otp/id Add Device' , (done) => {
        axios.post(`http://localhost:${PORT}/api/my-devices`, {
                "device": {
                  "id": "aaaaa",
                  "config": {
                    "min": -22,
                    "max": 80,
                    "room": "bedroom",
                    "active": true
                  },
                  "otp": "aaaa"
                },
        }, {headers: {
            Authorization: `${accessToken2}`
        }
        }).then((res) => {
            assert.equal(res.status, 403);
            done();
        }).catch((err) => {
            if (err.response.status === 403 && err.response.data.error === true && err.response.data.message === "Invalid match (device id / otp)") {
                done();
            } else {
                done(err);
            }
        });
    });

    it ('Empty Request Add device' , (done) => {
        axios.post(`http://localhost:${PORT}/api/my-devices`, {}, {headers: {
            Authorization: `${accessToken2}`
        }
    }).then((res) => {
            assert.equal(res.status, 400);
        }).catch((err) => {
            if (err.response.status === 400 ||  err.response.data.error === "Bad request" || err.response.data.message === "FAILED" || err.response.data.message === "Bad request" ) {
                done();
            } else {
                done(err);
            }
        });
    });
});

/**
 * test for retrieving device stats and their responses
 */
describe('get device stats endpoint', () => {
    it('user trying to get a non existent device gives an error', (done) => {
        axios.get(`http://localhost:${PORT}/api/stats/0`, {
            headers: {
                Authorization: `${accessToken2}`
            }
        }).then((res) => {
            assert.equal(res.status, 401);
            done(res);
        }).catch((err)=> {
            assert.equal(err.response.status, 401);
            assert.equal(err.response.data.error, "Unauthorized");
            done();
        });
    });

    it('user trying to get a device they do not own gives an error', (done) => {
        axios.get(`http://localhost:${PORT}/api/stats/33`, {
            headers: {
                Authorization: `${accessToken2}`
            }
        }).then((res) => {
            assert.equal(res.status, 401);
            done(res);
        }).catch((err)=> {
            assert.equal(err.response.status, 401);
            done();
        });
    });

    it('Admin should get any devices', (done) => {
        axios.get(`http://localhost:${PORT}/api/stats/33`, {
            headers: {
                Authorization: `${accessToken}`
            }
        }).then((res) => {
            assert.equal(res.status, 200);
            done();
        }).catch((err)=> {
            done(err);
        }); 
    })

    it ('user can get device stats they own', (done) => {
        axios.get(`http://localhost:${PORT}/api/stats/${deviceID}`, {
            headers: {
                Authorization: `${accessToken2}`
            }
        }).then((res) => {
            assert.equal(res.status, 200);
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it ('user unauthorized to get device stats', (done) => {
        axios.get(`http://localhost:${PORT}/api/stats/${deviceID}`, {
            headers: {
                Authorization: "112321123"
            }
        }).then((res) => {
            assert.equal(res.status, 401);
        }).catch((err) => {
            if (err.response.status === 401 || err.response.data.error === "Unauthorized") {
            done();
            }else{
                done(err);
            }
        });
    });
});


/**
 * test for deleting device and their responses
 */

describe('Delete a device endpoint', () => {
    it ('user can delete a device that they own', (done) => {
        axios.delete(`http://localhost:${PORT}/api/alter/${deviceID}`, {
            headers: {
                Authorization: `${accessToken2}`
            }
        }).then((res) => {
            assert.equal(res.status, 200);
            assert.equal(res.data.message, "Success device deleted");

            get(ref(db, `users/${SELIM_ID}`)).then((snapshot) => {
                let user = snapshot.val();
                user.owns.forEach((device) => {
                    assert(device !== deviceID);
                });
            });
            get(ref(db, `devices/${deviceID}`)).then((snapshot) => {
                let device = snapshot.val();
                device.owners.forEach((user) => {
                    assert(user !== SELIM_ID);
                })
            })
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it ('user cannot delete a device that they do not own', (done) => {
        axios.delete(`http://localhost:${PORT}/api/alter/0`, {
            headers: {
                Authorization: `${accessToken2}`
            }
        }).then((res) => {
            assert.equal(res.status, 401);
            done();
        }).catch((err) => {
            if (err.response.status === 401 && err.response.data.error === "Unauthorized") {
                done();
            } else {
                done(err);
            }
        });
    });
});

/**
 * test for getting profile info and their responses
 */

describe('My profile endpoint', () => {
    it ('User can get their profile', (done) => {
        axios.get(`http://localhost:${PORT}/api/profile/`, {
            headers: {
                Authorization: `${accessToken2}`
            }
        }).then((res) => {
            assert.equal(res.status, 200);
            assert(res.data.meta.createdAt);
            assert(res.data.meta.lastLoginAt);
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it ('Non-Admin cannot get user profile information, response = 401', (done) => {
        axios.get(`http://localhost:${PORT}/api/profile/${SELIM_ID}`, {
            headers: {
                Authorization: `${accessToken2}`
            }
        }).then((res) => {
            assert.equal(res.status, 401);
            done();
        }).catch((err) => {
            assert.equal(err.response.status, 401);
            assert.equal(err.response.data.error, "Unauthorized access");
            done();
        });
    });

    it ('Admin cannot get user profile information if non-existent profile = null', (done) => {
        let id = '1111';
        axios.get(`http://localhost:${PORT}/api/profile/${id}`, {
            headers: {
                Authorization: `${accessToken}`
            }
        }).then((res) => {
            assert.equal(res.status, 200);
            assert.equal(res.data.profile, null);
            set(ref(db, `users/${id}`), null);
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it('User cannot get his/her information if not logged in', (done) => {
        axios.get(`http://localhost:${PORT}/api/profile/`, {
            headers: {
                Authorization: `random`
            }
        }
        ).then((res) => {
            assert.equal(res.status, 401);
            done();
        }).catch((err) => {
            if (err.response.status == 401){
                assert.equal(err.response.data.error, "You are not authorized to make this request");
                done();
            }
            else {
                done(err);
            }
        })
    });
});

/**
 * Test the logout endpoint
 */

describe('logout endpoint', () => {
    it('logout endpoint works', (done) => {
        axios.post(`http://localhost:${PORT}/api/logout`, {}, {
            headers: {
                Authorization: `${accessToken}`
            }
        }).then((res) => {
            assert.equal(res.status, 200);
            done();
        }).catch((err) => {
            done(err);
        });
    });
});

/**
 * test for edit profile endpoint
 */
describe('Edit-Profile endpoint', () => {
    it('User can edit his/her address', (done) => {
        axios.put(`http://localhost:${PORT}/api/profile/`, {
            credentials : {
                email : "",
                password : ""
            },
            address : 'home'
        }, {headers: {
                Authorization: `${accessToken2}`
            }
        }
        ).then((res) => {
            assert.equal(res.status, 200);
            done();
        }).catch((err) => {
            done(err);
        })
    });

    it('User can edit his/her information blank and unchanged', (done) => {
        axios.put(`http://localhost:${PORT}/api/profile/`, {
            credentials : {
                email : "",
                password : ""
            },
            address : ''
        }, {headers: {
                Authorization: `${accessToken2}`
            }
        }
        ).then((res) => {
            assert.equal(res.status, 200);
            done();
        }).catch((err) => {
            done(err);
        })
    });

    it('User cannot edit his/her information if not logged in', (done) => {
        axios.put(`http://localhost:${PORT}/api/profile/`, {
            credentials : {
                email : "",
                password : ""
            },
            address : ''
        }, {headers: {
                Authorization: `random`
            }
        }
        ).then((res) => {
            assert.equal(res.status, 401);
            done();
        }).catch((err) => {
            if (err.response.status == 401){
                assert.equal(err.response.data.error, "You are not authorized to make this request");
                done();
            }
            else {
                done(err);
            }
        })
    });

    it('User can edit his/her email', (done) => {
        axios.put(`http://localhost:${PORT}/api/profile/`, {
            credentials : {
                email : "pain@gmail.com",
                password : ""
            },
            address : ''
        }, {headers: {
                Authorization: `${accessToken2}`
            }
        }
        ).then((res) => {
            assert.equal(res.status, 200);
            done();
        }).catch((err) => {
            done(err);
        })
    });

    it('try and login with new email', (done) => {
        axios.post(`http://localhost:${PORT}/api/login`, {
            email: "pain@gmail.com",
            password: ACC_PASSWORD2
        }).then((res) => {
            assert.equal(res.status, 200);
            assert.equal(res.data.error, false);
            assert.equal(res.data.message, "Logged in!");
            accessToken2 = res.data.accessToken; // set the accesstoken for later use
            done();
        }).catch((err) => {
            done(err);
        })
    });

    it('User can edit his/her email, continuation..', (done) => {
        axios.put(`http://localhost:${PORT}/api/profile/`, {
            credentials : {
                email : "s.el.sayed.aly@student.rug.nl",
                password : ""
            },
            address : ''
        }, {headers: {
                Authorization: `${accessToken2}`
            }
        }
        ).then((res) => {
            assert.equal(res.status, 200);
            done();
        }).catch((err) => {
            done(err);
        })
    });

    it('try and login with old email again', (done) => {
        axios.post(`http://localhost:${PORT}/api/login`, {
            email: "s.el.sayed.aly@student.rug.nl",
            password: ACC_PASSWORD2
        }).then((res) => {
            assert.equal(res.status, 200);
            assert.equal(res.data.error, false);
            assert.equal(res.data.message, "Logged in!");
            accessToken2 = res.data.accessToken; // set the accesstoken for later use
            done();
        }).catch((err) => {
            done(err);
        })
    });

    it('User can edit his/her password', (done) => {
        axios.put(`http://localhost:${PORT}/api/profile/`, {
            credentials : {
                email : "",
                password : ACC_PASSWORD
            },
            address : ''
        }, {headers: {
                Authorization: `${accessToken2}`
            }
        }
        ).then((res) => {
            assert.equal(res.status, 200);
            done();
        }).catch((err) => {
            done(err);
        })
    });
    
    it('try and login with new password', (done) => {
        axios.post(`http://localhost:${PORT}/api/login`, {
            email: "s.el.sayed.aly@student.rug.nl",
            password: ACC_PASSWORD
        }).then((res) => {
            assert.equal(res.status, 200);
            assert.equal(res.data.error, false);
            assert.equal(res.data.message, "Logged in!");
            accessToken2 = res.data.accessToken; // set the accesstoken for later use
            done();
        }).catch((err) => {
            done(err);
        })
    });

    it('User can edit his/her password, back to normal', (done) => {
        axios.put(`http://localhost:${PORT}/api/profile/`, {
            credentials : {
                email : "",
                password : ACC_PASSWORD2
            },
            address : ''
        }, {headers: {
                Authorization: `${accessToken2}`
            }
        }
        ).then((res) => {
            assert.equal(res.status, 200);
            done();
        }).catch((err) => {
            done(err);
        });        
    });   
});


