// DEV LAB: saveRoutes.js - this file offers a set of routes for displaying and saving the user's content to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

module.exports = function(app) {

    // GET route for getting all of the content saved to a specific user - pulls this data from the Content table
    app.get("/api/saves", function(req, res) {
      var query = {};
      if (req.query.user_id) {
        query.userId = req.query.user_id;
      }
      // 1. Add a join here to include all of the users to these resources
      db.Content.findAll({
        include: [{
            model: db.User, 
            required: false
        }],
        where: query
      }).then(function(savedContent) {
        res.json(savedContent);
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
      }).then(function(savedContent) {
        // console.log(savedContent);
        res.json(savedContent);
      });
    });


    app.post("/api/saves", function(req, res){
        //client-side script should give us an object with two keys: a content id and a user id for the specific item saved by the specific user, respectively
        db.Save.create(req.body).then(function(savedContent){
            res.json(savedContent);
        });
        
    })

    app.delete("/api/saves/:id", function(req, res) {
        db.Save.destroy({
          where: {
            id: req.params.id
          }
        }).then(function(savedContent) {
          res.json(savedContent);
        });
      });
    
}