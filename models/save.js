module.exports = function(sequelize, DataTypes) {
    var Save = sequelize.define("Save");

    Save.associate = function(models) {

      Save.belongTo(models.User, {
        foreignKey: {
          allowNull: false
        }
      });

    };


    return Save;
};