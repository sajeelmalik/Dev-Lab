module.exports = function (sequelize, DataTypes) {
  var Content = sequelize.define("Content", {
    conceptTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    contentTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    links: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1],
        isUrl: true
      }
    },
    contentBody: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    saves: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        len: [1]
      }
    }
  }, {});


  Content.associate = function (models) {
    // Content can't be created without an User due to the foreign key constraint
    Content.belongsToMany(models.User, {
      through: 'User_Content',
      as: "saveBy"

    });

  };


  return Content;
};