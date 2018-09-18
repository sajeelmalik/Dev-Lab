// DEV LAB: userRoutes.js - this file offers a set of routes for displaying and saving users to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function (app) {

  app.get('/api/users', function (req, res) {
    db.User.findAll({
      include: [{
        all: true
      }]
    }).then(function (resp) {
      res.json(resp)
    })
  })
  // content route for creating a new user
  app.post("/api/users", function (req, res) {
    db.User.create(req.body).then(function (dbUser) {
      res.json(dbUser);
    });
  });

  // DELETE route for deleting users
  app.delete("/api/users/:id", function (req, res) {
    db.User.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbUser) {
      res.json(dbUser);
    });
  });
  app.put('/api/users/:id', function (req, res, next) {
    db.User.findById(req.params.id)
      .then(user => {
        user.addContent(req.body.contentId)
      }).then(res.send.bind(res))
      .catch(next)
  })
  // PUT route for updating user's password
  app.put("/api/users", function (req, res) {
    db.User.update(
      req.body.password, {
        where: {
          id: req.body.id
        }
      }).then(function (dbUser) {
      res.json(dbUser);
    });
  });
};