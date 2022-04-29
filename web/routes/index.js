import express from "express";

const router = express.Router();


router.get('/', function(req, res) {
    res.render('index', { name: 'Express' });
});


export default {
    router: router
}