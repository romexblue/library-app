module.exports = (sequelize, DataTypes) => {
    const Reservation = sequelize.define("Reservation", {
       date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          unique: 'compositeIndex' //handles reservation of same date and start time
       },
       start_time:{
         type: DataTypes.TIME,
         allowNull: false,
         unique: 'compositeIndex' 
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
       }
    }, {
       timestamps: false
    });

    Reservation.associate = (models) => {
        Reservation.belongsToMany(models.Students, { through: 'ReservationStudents', timestamps: false });
      };
 
    return Reservation
 }
 