module.exports = (sequelize, DataTypes) => {

    const Confab = sequelize.define("Confab", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Open', 'Closed'),
            allowNull: false
        }
    }, { timestamps: false });

    Confab.associate = (models) => {
        Confab.hasMany(models.Reservation, {
            onDelete: "cascade",
        })
    };

    return Confab
} 