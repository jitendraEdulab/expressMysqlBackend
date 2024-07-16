// 'use strict';
// const { Model } = require('sequelize');
// const bcrypt = require('bcrypt');

// module.exports = (sequelize, DataTypes) => {
//   class User extends Model {
//     static associate(models) {
//       // Define associations if any
//     }
//   }

//   User.init({
//     username: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//       validate: {
//         notNull: { msg: 'Username cannot be null' },
//         notEmpty: { msg: 'Username cannot be empty' }
//       }
//     },
//     fullname: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notNull: { msg: 'Fullname cannot be null' },
//         notEmpty: { msg: 'Fullname cannot be empty' },
//         noNumbersOrSpecialChars(value) {
//           if (!/^[a-zA-Z ]+$/.test(value)) {
//             throw new Error('Fullname cannot contain numbers or special characters');
//           }
//         }
//       }
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notNull: { msg: 'Password cannot be null' },
//         notEmpty: { msg: 'Password cannot be empty' }
//       }
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//       validate: {
//         notNull: { msg: 'Email cannot be null' },
//         notEmpty: { msg: 'Email cannot be empty' },
//         isEmail: { msg: 'Invalid email format' }
//       }
//     },
//     profile: {
//       type: DataTypes.STRING,
//       allowNull: true  // Profile can be optional
//     }
//   }, {
//     sequelize,
//     modelName: 'User',
//     tableName: 'users', // Optional: Specify the table name if different from model name
//     timestamps: true,   // Optional: Add timestamps (createdAt, updatedAt)
//     underscored: true,  // Optional: Use snake_case for auto-generated attribute names
//     hooks: {
//       beforeCreate: async (user) => {
//         if (user.password) {
//           const hashedPassword = await bcrypt.hash(user.password, 10);
//           user.password = hashedPassword;
//         }
//       },
//       // You can also add beforeUpdate hook if you want to hash password on update
//     }
//   });

//   return User;
// };




// ----------------------------------------------------------------------------------------------------------------------------------






'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
const userSchema = require('../validations/uservalidation'); // Import Joi schema for validation

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Profile, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        // Hash the password before saving to the database
        if (user.password) {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          user.password = hashedPassword;
        }
      },
      beforeUpdate: async (user) => {
        // Hash the password before updating the database
        if (user.changed('password')) {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          user.password = hashedPassword;
        }
      }
    }
  });

  return User;
};
