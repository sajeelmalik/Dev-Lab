// DEV LAB: saveRoutes.js - this file offers a set of routes for displaying and saving the user's content to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

module.exports = function(app) {

    // GET route for getting all of the contents
    app.get("/api/saves", function(req, res) {
      var query = {};
      if (req.query.user_id) {
        query.userId = req.query.user_id;
      }
      // 1. Add a join here to include all of the users to these resources
      db.Content.findAll({
        include: [db.User],
        where: query
      }).then(function(dbcontent) {
        res.json(dbcontent);
      });
    });
  
    // Get route for retrieving a single resource
    app.get("/api/saves/:id", function(req, res) {
      // 2. Add a join here to include the user who wrote the content
      db.Content.findOne({
        include: [db.User],
        where: {
          id: req.params.id
        }
      }).then(function(dbcontent) {
        console.log(dbcontent);
        res.json(dbcontent);
      });
    });
}