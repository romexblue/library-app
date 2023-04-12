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
      type: {
         type: DataTypes.ENUM('Student', 'Faculty', 'Staff'),
         allowNull: false
      },
      date_of_expiry: {
         type: DataTypes.DATEONLY,
         allowNull: false,
      },
   }, { timestamps: false });

   Students.associate = (models) => {
      Students.hasMany(models.Records, {
         onDelete: "cascade",
      });
      Students.belongsToMany(models.Reservation, { through: 'ReservationStudents', timestamps: false, });
   };

   return Students
} 