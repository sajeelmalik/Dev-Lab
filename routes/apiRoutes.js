// DEV LAB: apiRoutes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

    // GET route for getting all of the resources
    app.get("/api/resources", function(req, res) {
      var query = {};
      if (req.query.user_id) {
        query.userId = req.query.user_id;
      }
      // 1. Add a join here to include all of the users to these resources
      db.Resource.findAll({
        include: [db.user],
        where: query
      }).then(function(dbResource) {
        res.json(dbResource);
      });
    });
  
    // Get route for retrieving a single Resource
    app.get("/api/resources/:id", function(req, res) {
      // 2. Add a join here to include the user who wrote the Resource
      db.Resource.findOne({
        include: [db.user],
        where: {
          id: req.params.id
        }
      }).then(function(dbResource) {
        console.log(dbResource);
        res.json(dbResource);
      });
    });
  
    // Resource route for saving a new Resource
    app.post("/api/resources", function(req, res) {
      db.Resource.create(req.body).then(function(dbResource) {
        res.json(dbResource);
      });
    });
  
    // DELETE route for deleting resources
    app.delete("/api/resources/:id", function(req, res) {
      db.Resource.destroy({
        where: {
          id: req.params.id
        }
      }).then(function(dbResource) {
        res.json(dbResource);
      });
    });
  
    // PUT route for updating resources
    app.put("/api/resources", function(req, res) {
      db.Resource.update(
        req.body,
        {
          where: {
            id: req.body.id
          }
        }).then(function(dbResource) {
        res.json(dbResource);
      });
    });
  };
  