// DEV LAB: htmlRoutes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************
// Dependencies
// =============================================================
var path = require("path");

// Routes
// =============================================================
module.exports = function(app, auth) {

  // index route loads index.html
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  // All educational resources in resources.html
  // app.get("/resources", function(req, res) {
  //   res.sendFile(path.join(__dirname, "../public/resources.html"));
  // });

 
};
