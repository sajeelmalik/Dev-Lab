// DEV LAB: Server.js - This file is the initial starting point for the Node/Express server.
// ******************************************************************************
// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var passport   = require('passport');
var session    = require('express-session');


// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));
// parse application/json
app.use(bodyParser.json());

// For Passport
app.use(session({ secret: (process.env.secret || 'farley the cat'),resave: true, saveUninitialized:true, cookie: { secure: false }})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
//load passport strategies
require('./config/passport/passport.js')(passport, db.User);

// Static directory

// Routes
// =============================================================
require("./routes/contentRoutes.js")(app);
require("./routes/userRoutes.js")(app);
require("./routes/htmlRoutes.js")(app);
require("./routes/authRoutes.js")(app, passport);

app.use(express.static("public"));


// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({}).then(function () {
  app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
}); 