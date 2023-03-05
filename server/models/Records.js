module.exports = (sequelize, DataTypes) => {
   const Records = sequelize.define("Records", {
      date: {
         type: DataTypes.DATEONLY,
         allowNull: false,
      },
      time_in: {
         type: DataTypes.TIME
      },
      time_out: {
         type: DataTypes.TIME,
         allowNull: true
      }
   }, {
      timestamps: false
   }
   );

   return Records
}
