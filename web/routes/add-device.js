import {database} from '../server.js';
import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
})

router.get("/", (req, res) => {
    res.render("index", { name: "DB" });
})

export default {
    router: router
}
