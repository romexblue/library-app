module.exports = (sequelize, DataTypes) => {

    const Floor = sequelize.define("Floor", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        current_count: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        max_capacity: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        status:{
            type: DataTypes.ENUM('Open', 'Closed'),
            allowNull: false
        }
    }, { timestamps: false });
    Floor.associate = (models) => {
        Floor.hasMany(models.Records, {
            onDelete: "cascade",
        })
    };

    return Floor
} 