module.exports = (sequelize, DataTypes) => {

   const Students = sequelize.define("Students", {
      name: {
         type: DataTypes.STRING,
         allowNull: false
      }, 
      schoold_id: {
         type: DataTypes.INTEGER,
         allowNull: false
      },
      course: {
         type: DataTypes.STRING,
         allowNull: false
      }
   }, { timestamps: false });

   Students.associate = (models) => {
      Students.hasMany(models.Records, {
         onDelete: "cascade",
      })
   };

   return Students
} 