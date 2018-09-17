// DEV LAB: userRoutes.js - this file offers a set of routes for displaying and saving users to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {
  
    // content route for creating a new user
    app.post("/api/users", function(req, res) {
      db.User.create(req.body).then(function(dbUser) {
        res.json(dbUser);
      });
    });
  
    // DELETE route for deleting users
    app.delete("/api/users/:id", function(req, res) {
      db.User.destroy({
        where: {
          id: req.params.id
        }
      }).then(function(dbUser) {
        res.json(dbUser);
      });
    });
  
    // PUT route for updating user's password
    app.put("/api/users", function(req, res) {
      db.User.update(
        req.body.password,
        {
          where: {
            id: req.body.id
          }
        }).then(function(dbUser) {
        res.json(dbUser);
      });
    });
  };
  