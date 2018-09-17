module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        userPassword: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    User.associate = function(models) {
        // When an User is deleted, also delete any associated content
        User.hasMany(models.Content, {
          onDelete: "cascade"
        });
      };
  
    return User;
};