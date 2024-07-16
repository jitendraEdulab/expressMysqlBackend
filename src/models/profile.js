const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Profile extends Model {
        static associate(models){
            Profile.belongsTo(models.User, {
                foreignKey: 'userId',
                onDelete: 'CASCADE'
              });
        }
    }

    Profile.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull : false,
            unique: true
        },
        profile:{
            type: DataTypes.STRING,
            allowNull : false
        },
        summary:{
            type: DataTypes.STRING,
            allowNull: false
        }
    },{
        sequelize,
        modelName: 'Profile',
        tableName: 'profiles',
        timestamps: true
    });

    return Profile;

}