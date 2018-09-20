'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    // Add altering commands here.
    // Return a promise to correctly handle asynchronicity.

    // Example:
    return queryInterface.bulkInsert('contents', [{
        conceptTitle: 'functions',
        contentTitle: 'Function CLosure',
        links: 'www.google.com',
        contentBody: 'Functions link lorem ipsum',
        saves: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        conceptTitle: 'api calls',
        contentTitle: 'Fetch & aJax',
        links: 'www.yahoo.com',
        contentBody: 'functions',
        saves: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        conceptTitle: 'conditionals',
        contentTitle: 'If/Else Statements',
        links: 'www.gmail.com',
        contentBody: 'functions',
        saves: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        conceptTitle: 'functions',
        contentTitle: 'ES6 Arrow Functions',
        links: 'www.reddit.com',
        contentBody: 'functions',
        saves: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};