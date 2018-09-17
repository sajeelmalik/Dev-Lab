module.exports = function(sequelize, DataTypes) {
    var Vote = sequelize.define("Vote", {
      score: {
        type: DataTypes.INTEGER
      }
    });


    Vote.associate = function(models) {
      Vote.belongTo(models.User, {
        foreignKey: {
          allowNull: false
        }
      });
    };

    return Vote;
};