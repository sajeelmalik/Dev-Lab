'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    // Add altering commands here.
    // Return a promise to correctly handle asynchronicity.

    // Example:
    return queryInterface.bulkInsert('users', [{
        userName: 'asdf',
        userPassword: 'John Doe',
        userEmail: 'steve@aol.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userName: 'asdf',
        userPassword: 'Steve Doe',
        userEmail: 'steve@aol.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userName: 'asdf',
        userPassword: 'Calvin Doe',
        userEmail: 'steve@aol.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userName: 'asdf',
        userPassword: 'Arnold Doe',
        userEmail: 'steve@aol.com',
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