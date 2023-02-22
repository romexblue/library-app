module.exports = (sequelize, DataTypes) => {

    const Floor = sequelize.define("Floor", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, { timestamps: false });
    Floor.associate = (models) => {
        Floor.hasMany(models.Records, {
            onDelete: "cascade",
        })
    };

    return Floor
} 