import * as server from '../web/server.js';
import assert from 'assert';
import { describe } from 'mocha';
import axios from 'axios';
import { ref, set, get} from "firebase/database";
import {db} from "../lib/firebase.js";
import {PORT, PASSWORD, ACC_PASSWORD, ACC_PASSWORD2, TEST_PASSWORD, getLog, getUser} from '../lib/config.js';



var accessToken;
var registerAcc;
var accessToken2;
const USERID = 'VfULdqBkeYXXtjP0xK6lVvYQTIW2';
const SELIM_ID = 'cKJS6IQrayM9EUt4Zb7IFgHVjBC3';

const deviceID = 31;
const otp = "PYFL-TUVB-MGEE-SYIP";
const device = {
    "device": {
      "id": deviceID,
      "config": {
        "min": -22,
        "max": 80,
        "room": "bedroom",
        "active": true
      },
      "otp": otp
    }};



describe('Server can start', () => {
    it('running init', (done) =>{
        server.init();
        done();
    });
});



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

/**
 * Test the logout endpoint
 */

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
});

describe('non-admin login', () => {
    it('setting non-admin accessToken', (done) => {
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

describe('My devices endpoint', () => {
    
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
        }, {headers: {
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
        

    });
});

describe('Edit a device endpoint', () => {
    it ('user can alter his chosen device', (done) => {
        axios.put(`http://localhost:${PORT}/api/my-devices`, {
            device: {
                id: deviceID,
                config: {
                    min: 0,
                    max:40,
                    room: "nowhere man",
                    active: true
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
                let device = snapshot.val();
                assert.equal(device.config.min, 0);
                assert.equal(device.config.max, 40);
                assert.equal(device.config.room, "nowhere man");
                assert.equal(device.config.active, true);
                done();
            });
        }).catch((err) => {
            done(err);
        });
    });

    it ('user cannot alter a device that they do not own', (done) => {
        axios.post(`http://localhost:${PORT}/api/my-devices`, {
            device: {
                id : 0
            }
        }, {
            headers: {
                Authorization: `${accessToken2}`
            }
        }).then((res) => {
            assert.equal(res.status, 401);
            assert.equal(res.data.error, true);
            assert.equal(res.data.message, "Unauthorized");
            //res.status(401).send({error: true, message : "Unauthorized"});
            done();
        }).catch((err) => {
            done(err);
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
            done();
        }).catch((err) => {
            if (err.response.status === 403 && err.response.data.error === true && err.response.data.message === "Invalid match (device id / otp)") {
                done();
            } else {
                done(err);
            }
            // assert.equal(err.status, 403);
            // assert.equal(err.data.error, false);
            // assert.equal(err.data.message, "Invalid match (device id / otp)");
            // done();
        });
        
        

    });

    it ('Empty Request Add device' , (done) => {
        axios.post(`http://localhost:${PORT}/api/my-devices`, {}, {headers: {
            Authorization: `${accessToken2}`
        }
    }).then((res) => {
            done();
        }).catch((err) => {
            if (err.response.status === 400 ||  err.response.data.error === "Bad request" || err.response.data.message === "FAILED" || err.response.data.message === "Bad request" ) {
                done();
            } else {
                done(err);
            }
            // assert.equal(err.status, 400);
            // assert.equal(err.data.error, true);
            // assert.equal(err.data.message, "Bad request");
            // done();
        });
        
        

    });

})

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

    // it ('user cannot delete a device that they do not own', (done) => {
    //     axios.delete(`http://localhost:${PORT}/api/alter/0`, {
    //         headers: {
    //             Authorization: `${accessToken}`
    //         }
    //     }).then((res) => {
    //         assert.equal(res.status, 401);
    //         assert.equal(res.data.error, true);
    //         assert.equal(res.data.message, "Unauthorized");
    //         done();
    //     }).catch((err) => {
    //         done(err);
    //     });
    // });
});

describe('My profile endpoint', () => {
    it ('Non-Admin cannot get user profile information, response = 401', (done) => {
        axios.get(`http://localhost:${PORT}/api/profile/${USERID}`, {
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
            console
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
 * test delete request in register endpoint
 */ 
describe('delete account', () => {
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
            assert.equal(res.data.message, "Success, please make sure to verify your email in order to login");
            registerAcc = res.data.accessToken;
            done();
        }
        ).catch((err) => {
            done(err);
        });
    });
});


/**test for alter endpoint
describe('alter endpoint', () => {
    it('alter endpoint works', (done) => {
        axios.put(`http://localhost:${PORT}/api/alter`, {},{
            "0" : min,
            "20" : max,
            "test" : room,
            "active" : active,

        }).then((res) => {
            assert.equal(res.status, 200);
            done();
        }
        ).catch((err) => {
            done(err);
        });
    } );
}
);
**/



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

    it('User can edit his/her password', (done) => {
        axios.put(`http://localhost:${PORT}/api/profile/`, {
            credentials : {
                email : "",
                password : "selim123"
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

    // it('User can edit his/her password, back to normal', (done) => {
    //     axios.put(`http://localhost:${PORT}/api/profile/`, {
    //         credentials : {
    //             email : "",
    //             password : "selim123"
    //         },
    //         address : ''
    //     }, {headers: {
    //             Authorization: `${accessToken2}`
    //         }
    //     }
    //     ).then((res) => {
    //         assert.equal(res.status, 200);
    //         done();
    //     }).catch((err) => {
    //         done(err);
    //     })
    // });

    // it('User can edit his/her email', (done) => {
    //     axios.put(`http://localhost:${PORT}/api/profile/`, {
    //         credentials : {
    //             email : "pain@gmail.com",
    //             password : ""
    //         },
    //         address : ''
    //     }, {headers: {
    //             Authorization: `${accessToken2}`
    //         }
    //     }
    //     ).then((res) => {
    //         assert.equal(res.status, 200);
    //         done();
    //     }).catch((err) => {
    //         done(err);
    //     })
    // });

    // it('User can edit his/her email, continuation..', (done) => {
    //     axios.put(`http://localhost:${PORT}/api/profile/`, {
    //         credentials : {
    //             email : "s.el.sayed.aly@student.rug.nl",
    //             password : ""
    //         },
    //         address : ''
    //     }, {headers: {
    //             Authorization: `${accessToken2}`
    //         }
    //     }
    //     ).then((res) => {
    //         assert.equal(res.status, 200);
    //         done();
    //     }).catch((err) => {
    //         done(err);
    //     })
    // });

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
});


