const app = require('express')();
const http = require('http').Server(app);
const path = require('path');
const domain = require('domain');
const config = require('config');
const session = require('express-session');
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');

const db = require('./libs/db.js');
const log = require('./libs/log.js');

app.use(log.access);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

mongoose.connect(config.mongodb.dsn);
app.use(session({
    secret: "secret key",
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}));

db.connect();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    const reqd = domain.create();
    reqd.on("error", function(err) {
        showServerError(res, err);
    });
    reqd.run(next);
});

app.use("/", require("./controllers/index.js")());
app.use("/detail", require("./controllers/detail.js")());

app.use(function(req, res, next) {
    showNotFound(res);
});

app.use(function(err, req, res, next) {
    showServerError(res, err);
});

http.listen(config.server.port, function() {
    console.log(`listening on *: ${config.server.port}`);
});

const showNotFound = function(res) {
    res.status(404);
    res.render("404");
};

const showServerError = function(res, err) {
    log.error(err);
    res.status(500);
    res.render("500");
};