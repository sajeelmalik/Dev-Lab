module.exports = function(sequelize, DataTypes) {
    var Save = sequelize.define("Save", {
      created_at: {
        type: Sequelize.DATE
      }
    }, {
      timestamps: false
    });

    Save.associate = function(models) {

      Save.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        }
      });

    };


    return Save;
};