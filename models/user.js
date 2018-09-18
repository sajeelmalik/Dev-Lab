module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        userEmail: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                IsEmail: true
            }
        },
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

    User.associate = function (models) {
        // When an User is deleted, also delete any associated content
        User.belongsToMany(models.Content, {
            through: 'User_Content'
        });
    };

    return User;
};