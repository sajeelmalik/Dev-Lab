// DEV LAB: contentRoutes.js - this file offers a set of routes for displaying and saving content data (consisting of all the educational material) to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function (app) {

  // GET route for getting all of the resources
  app.get("/api/contents", function (req, res) {
    db.Content.findAll({
      all: true
    }).then(function (dbcontent) {
      res.json(dbcontent);
    });
  });

  // content route for saving a new resource, inputted by a user (this path will be outlined in the client-side script)
  app.post("/api/contents", function (req, res) {
    db.Content.create(req.body).then(function (dbcontent) {
      res.json(dbcontent);
    });
  });

  // DELETE route for deleting contents
  app.delete("/api/contents/:id", function (req, res) {
    db.Content.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbcontent) {
      res.json(dbcontent);
    });
  });

  // PUT route for updating content; we may or may not use this functionality
  app.put("/api/contents", function (req, res) {
    db.Content.update(
      req.body, {
        where: {
          id: req.body.id
        }
      }).then(function (dbcontent) {
      res.json(dbcontent);
    });
  });
};