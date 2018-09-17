// DEV LAB: voteRoutes.js - this file offers a set of routes for displaying and saving votes to the db
// *********************************************************************************

// Dependencies
// =============================================================
// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {
  
    // content route for creating a new Vote
    app.post("/api/votes", function(req, res) {
      db.Vote.create(req.body).then(function(dbVote) {
        res.json(dbVote);
      });
    });
  
    // DELETE route for deleting votes
    app.delete("/api/votes/:id", function(req, res) {
      db.Vote.destroy({
        where: {
          id: req.params.id
        }
      }).then(function(dbVote) {
        res.json(dbVote);
      });
    });
  
    // PUT route for updating Vote's password
    app.put("/api/votes", function(req, res) {
      db.Vote.update(
        req.body,
        {
          where: {
            id: req.body.id
          }
        }).then(function(dbVote) {
        res.json(dbVote);
      });
    });
  };