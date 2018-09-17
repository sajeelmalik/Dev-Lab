module.exports = function(sequelize, DataTypes) {
    var Vote = sequelize.define("Vote", {
      score: {
        type: DataTypes.INTEGER
      }
    });


    Vote.associate = function(models) {
      Vote.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        }
      });
    };

    return Vote;
};