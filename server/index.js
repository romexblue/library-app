const express = require("express");
const cors = require("cors");
const app = express();
const { Op } = require("sequelize");
const db = require("./models");
const { Users, Records, Floor } = require("./models");

app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5000;

//routers
const recordRouter = require("./routes/Record");
app.use("/record", recordRouter);

const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);

const floorRouter = require("./routes/Floor");
app.use("/floor", floorRouter);

const studentsRouter = require("./routes/Students");
app.use("/student", studentsRouter);

const reservationRouter = require("./routes/Reservation");
app.use("/reservation", reservationRouter);

const confabRouter = require("./routes/Confab");
app.use("/confab", confabRouter);

db.sequelize.sync().then(async () => {
    const adminUser = await Users.findOne({ where: { type: "Admin" } });

    if (!adminUser) {
        // Create admin user
        Users.create({
            name: "Admin",
            username: "superAdmin",
            password: "capstone2023",
            type: "Admin",
        })
            .then(() => {
                console.log("Admin user created");
            })
            .catch((error) => {
                console.error("Error creating admin user:", error);
            });
    }

    // const currentDate = new Date();

    // const options = { timeZone: "Asia/Manila" };
    // const philippineDate = currentDate.toLocaleString("en-US", options).slice(0, 10);

    try { //resets on server restart
        await Floor.update({ current_count: 0 }, { where: {} });
        console.log("Current count reset to zero for all floors.");
    } catch (error) {
        console.error("Error resetting current count:", error);
    }

    app.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
    });
});
