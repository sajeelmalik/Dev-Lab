'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    // Add altering commands here.
    // Return a promise to correctly handle asynchronicity.

    // Example:
    return queryInterface.bulkInsert('contents', [{
        conceptTitle: 'CSS',
        contentTitle: `Wes Bos' CSS Grid Course`,
        links: 'www.cssgrid.io',
        contentBody: `CSS Grid is a brand new layout system in CSS! It's not a framework or library - it's an addition to the language that allows us to quickly create flexible, two dimensional layouts.

        We can use it to place, size, align and architect designs that were previously difficult or even impossible with floats or flexbox.
        
        CSS Grid may seem a bit daunting with new syntax and layout ideas, but it's fairly simple and can be broken down into a handful of powerful concepts that when used together will blow your mind and change the way you create layouts for the web forever.`,
        saves: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        conceptTitle: 'CSS',
        contentTitle: `Wes Bos' CSS Flex Course`,
        links: 'www.flexbox.io',
        contentBody: 'The first 13 videos are aimed at understanding the fundamentals of Flexbox - we will take a deep dive into understanding rows, columns, axes, wrapping, alignment, centering and layout. The last 7 are code alongs where we will build everything from a navigation to a mobile app layout entirely with Flexbox!',
        saves: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        conceptTitle: 'Conditionals',
        contentTitle: 'If/Else Statements',
        links: 'www.gmail.com',
        contentBody: 'functions',
        saves: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        conceptTitle: 'Functions',
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