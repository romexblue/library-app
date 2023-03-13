module.exports = (sequelize, DataTypes) => {

   const Students = sequelize.define("Students", {
      name: {
         type: DataTypes.STRING,
         allowNull: false
      },
      school_id: {
         type: DataTypes.STRING,
         allowNull: false
      },
      rfid: {
         type: DataTypes.STRING,
         allowNull: false
      },
      course: {
         type: DataTypes.STRING,
         allowNull: false
      },
      year: {
         type: DataTypes.ENUM('1st', '2nd', '3rd', '4th', '5th'),
         allowNull: false
      }
   }, { timestamps: false });

   Students.associate = (models) => {
      Students.hasMany(models.Records, {
         onDelete: "cascade",
      });
      Students.belongsToMany(models.Reservation, { through: 'ReservationStudents', timestamps: false, });
   };

   return Students
} 