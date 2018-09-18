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
        saves: 421,
        created_at: new Date()
      }, {
        conceptTitle: 'api calls',
        contentTitle: 'Fetch & aJax',
        links: 'www.yahoo.com',
        contentBody: 'functions',
        saves: 213,
        created_at: new Date()
      },
      {
        conceptTitle: 'conditionals',
        contentTitle: 'If/Else Statements',
        links: 'www.gmail.com',
        contentBody: 'functions',
        saves: 111,
        created_at: new Date()
      },
      {
        conceptTitle: 'functions',
        contentTitle: 'ES6 Arrow Functions',
        links: 'www.reddit.com',
        contentBody: 'functions',
        saves: 4021,
        created_at: new Date()
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