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
        res.sendFile(path.join(__dirname, "../public/signup.html"));
    });

    app.get("/signin", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/signin.html"));
    });

    app.post('/signup', passport.authenticate('local-signup', {
        failureRedirect: '/signup'
    }),function(res, req){
        res.cookie('userid', req.user.id, { maxAge: 2592000000 });  // Expires in one month
        res.redirect("/");
    }
    
    );

    app.post('/signin', passport.authenticate('local-signin', {
        
        successRedirect: '/',

        failureRedirect: '/signin'
    }), function(res, req){
        console.log("signing in?");
    });

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
