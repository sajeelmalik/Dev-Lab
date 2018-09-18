// DEV LAB: authRoutes.js - this file handles routes for signing up/signing in
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");
var path = require("path");


// Routes
// =============================================================
module.exports = function(app, passport) {
    app.get('/signup', function(req, res){
        res.sendFile(path.join(__dirname, "../public/signup.html"));
    });

    app.get("/signin", function(req, res){
        res.sendFile(path.join(__dirname, "../public/signin.html"));
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
 
        failureRedirect: '/signup'
    }
 
));

}
