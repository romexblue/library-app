module.exports = (sequelize, DataTypes) => {

   const Students = sequelize.define("Students", {
      school_id: {
         type: DataTypes.STRING,
         allowNull: false,
         primaryKey: true
      },
      type: {
         type: DataTypes.ENUM('STUDENT', 'FACULTY', 'SHSFACULTY', 'SHSSTUDENT'),
         allowNull: false
      },
      first_name: {
         type: DataTypes.STRING(64),
         allowNull: false
      },
      last_name: {
         type: DataTypes.STRING(64),
         allowNull: false
      },
      gender: {
         type: DataTypes.ENUM('M', 'F', 'U')
      },
      email: {
         type: DataTypes.STRING(64),
      },
      college: {
         type: DataTypes.STRING(24)
      },
      year: {
         type: DataTypes.STRING(24)
      },
      rfid: {
         type: DataTypes.STRING(24),
         index: true
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