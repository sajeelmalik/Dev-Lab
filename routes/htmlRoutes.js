// DEV LAB: htmlRoutes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************
// Dependencies
// =============================================================
var path = require("path");

// Routes
// =============================================================
module.exports = function(app) {

  // index route loads index.html
  app.get("/", function(req, res) {
    if(req.isAuthenticated()){
    res.cookie('userid', req.user.id, { maxAge: 2592000000 });  // Expires in one month
    }
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  // All educational resources in resources.html
  // app.get("/resources", function(req, res) {
  //   res.sendFile(path.join(__dirname, "../public/resources.html"));
  // });

  function isLoggedIn(req, res, next) {
    //console.log("HTML page: " + req.user.id);
    if (req.isAuthenticated())

        return next();

    res.redirect('/signin');

}
};
