module.exports = (sequelize, DataTypes) => {

   const Users = sequelize.define("Users", {
      name: {
         type: DataTypes.STRING,
         allowNull: false
      },
      username: {
         type: DataTypes.STRING,
         allowNull: false
      },
      type: {
         type: DataTypes.ENUM('Admin', 'Librarian', 'Guard'),
         allowNull: false
      },
      password: {
         type: DataTypes.STRING,
         allowNull: false
      }
   }, {
      timestamps: false,
   });

   return Users
} 