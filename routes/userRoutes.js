// DEV LAB: userRoutes.js - this file offers a set of routes for displaying and saving users to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function (app) {
  //WORKING
  app.get('/api/users', function (req, res) {
    db.User.findAll({
      include: [{
        all: true
      }]
    }).then(function (resp) {
      res.json(resp)
    })
  })

  //WORKING
  app.get('/api/users/:id', function (req, res) {
    db.User.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        all: true
      }]
    }).then(function (resp) {
      res.json(resp)
    })
  })


  //WORKING
  // content route for creating a new user
  app.post("/api/new/users", function (req, res) {
    db.User.create(req.body).then(function (dbUser) {
      res.json(dbUser);
    });
  });

  //WORKING
  // DELETE route for deleting saved Links
  app.delete("/api/delete/:userId/:contentId", function (req, res) {
    db.User.findById(req.params.userId)
      .then(user => {
        user.removeSavedLinks(req.params.contentId);
      })
      .then(() => {
        db.Content.decrement("saves", {
          where: {
            id: req.params.contentId,
          }
        })
      }).then(function (dbUser) {
        res.json(dbUser);
      }).catch(err => console.log(err));
  });

  //WORKING
  //Adds links to users
  app.put('/api/users/:id', function (req, res, next) {
    db.User.findById(req.params.id)
      .then(user => {
        user.addSavedLinks(req.body.contentId)
      })
      .then(() => {
        db.Content.increment("saves", {
          where: {
            id: req.body.contentId,
          }
        })
      })
      .then(res.json())
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


  // DELETE route for deleting users
  // app.delete("/api/users/:id", function (req, res) {
  //   db.User.destroy({
  //     where: {
  //       id: req.params.id
  //     }
  //   }).then(function (dbUser) {
  //     res.json(dbUser);
  //   });
  // });

  
};