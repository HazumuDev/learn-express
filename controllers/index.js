const express = require("express");
const test = require("../models/test.js");

module.exports = () => {
    const router = express.Router();
    router.get("/", (req, res, next) => {
        test.getAll()
            .then((rows) => {
                res.render("index", { items: rows });
        });
    });

    return router;
};