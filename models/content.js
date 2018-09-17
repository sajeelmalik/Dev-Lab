module.exports = function (sequelize, DataTypes) {
  var Content = sequelize.define("Content", {
    conceptTitle: {
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
    conceptBody: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    saves: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    created_at: {
      type: Sequelize.DATE
    }
  }, {
    timestamps: false
  });


  Content.associate = function (models) {
    // Content can't be created without an User due to the foreign key constraint
    Content.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
    Content.hasMany(models.Save, {
      foreignKey: {
        allowNull: false
      }
    });
    Content.hasMany(models.Vote, {
      foreignKey: {
        allowNull: false
      }
    });
  };


  return Content;
};