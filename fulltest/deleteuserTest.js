import * as server from '../web/server.js';
import assert from 'assert';
import { describe } from 'mocha';
import axios from 'axios';
import { ref, set, get} from "firebase/database";
import {db} from "../lib/firebase.js";
import { registerAcc } from './registerTest.js';
import {PORT, PASSWORD, ACC_PASSWORD, ACC_PASSWORD2, TEST_PASSWORD, getLog, getUser} from '../lib/config.js';


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