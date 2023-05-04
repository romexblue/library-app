module.exports = (sequelize, DataTypes) => {

    const ReservationStudent = sequelize.define("ReservationStudent", {
        reservationId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'Reservation',
                key: 'id'
            }
        },
        studentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'Students',
                key: 'school_id'
            }
        }
    }, {
        timestamps: false,
    });

    return ReservationStudent;
};