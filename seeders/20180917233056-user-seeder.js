'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    // Add altering commands here.
    // Return a promise to correctly handle asynchronicity.

    // Example:
    return queryInterface.bulkInsert('users', [{
        userName: 'John Doe',
        userPassword: 'password',
        userEmail: 'John@aol.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userName: 'Steve',
        userPassword: 'password',
        userEmail: 'steve@aol.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userName: 'Calvin',
        userPassword: 'password',
        userEmail: 'calvin@aol.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userName: 'Arnold',
        userPassword: 'password',
        userEmail: 'arnold@aol.com',
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