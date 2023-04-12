module.exports = (sequelize, DataTypes) => {
    const Reservation = sequelize.define("Reservation", {
       date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
       },
       start_time:{
         type: DataTypes.TIME,
         allowNull: false,
       },
       end_time:{
         type: DataTypes.TIME,
         allowNull: false,
       },
       reason:{
          type:DataTypes.STRING,
          allowNull: false
       },
       confirmation_status:{
         type: DataTypes.ENUM('Confirmed', 'Cancelled', 'Pending'),
         allowNull: false
       },
       phone:{
         type: DataTypes.STRING,
         allowNull: false
       }
    }, {
       timestamps: false
    });

    Reservation.associate = (models) => {
        Reservation.belongsToMany(models.Students, { through: 'ReservationStudents', timestamps: false });
        Reservation.belongsTo(models.Confab, {
         foreignKey: 'ConfabId'
      });
      Reservation.belongsTo(models.Users, {
         foreignKey: {
            name: 'confirmed_by'
         }
     });
      };
 
    return Reservation
 }
 