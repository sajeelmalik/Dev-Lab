// DEV LAB: contentRoutes.js - this file offers a set of routes for displaying and saving content data (consisting of all the educational material) to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");
var Sequelize = require('sequelize');
// Routes
// =============================================================
module.exports = function (app) {
  // app.get("/api/contents/all", function (req, res) {
  //   db.Content.findAll({
  //     include: [{
  //       all: true
  //     }]
  //   }).then(function (dbcontent) {
  //     res.json(dbcontent);
  //   });
  // });

  // GET route for getting all of the concent titles
  app.get("/api/contents", function (req, res) {
    db.Content.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('conceptTitle')), 'conceptTitle'],
      ],
      order: [
        ['conceptTitle', 'ASC']
      ]

    }).then(function (dbcontent) {
      res.json(dbcontent);
    });
  });


  // gets all the content per category
  app.get("/api/contents/:category", function (req, res) {
    console.log(req.body);
    db.Content.findAll({
      order: [
        ['saves', 'DESC']
      ],
      where: {
        conceptTitle: req.params.category
      },

    }).then(function (dbcontent) {
      res.json(dbcontent);
    });
  });

  // content route for saving a new resource, inputted by a user (this path will be outlined in the client-side script)
  app.post("/api/new/contents", function (req, res) {
    console.log(req.body);
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