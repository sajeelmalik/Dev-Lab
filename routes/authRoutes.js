// DEV LAB: authRoutes.js - this file handles routes for signing up/signing in
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var path = require("path");


// Routes
// =============================================================
module.exports = function (app, passport) {
    app.get('/signup', function (req, res) {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    app.get("/signin", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
         failureRedirect: '/signup'
    }),function(res, req){
       console.log("signing up...")
    }
    
    );

    app.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/',
        failureRedirect: '/signup'
        }), function(res, req){
            console.log("signing in...")
        }
    );

    app.get('/signout', function (req, res) {
        res.clearCookie('userid');

        req.session.destroy(function (err) {

            res.redirect('/');

        });
    });

    function isLoggedIn(req, res, next) {

        if (req.isAuthenticated())

            return next();

        res.redirect('/signin');

    }

}
