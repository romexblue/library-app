const express = require('express');
const cors = require('cors');
const app = express();

const db = require('./models');
const { Users } = require('./models');

app.use(express.json())
app.use(cors());
const port = process.env.PORT || 5000;

//routers
const recordRouter = require('./routes/Record');
app.use("/record", recordRouter);

const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);

const floorRouter = require('./routes/Floor');
app.use("/floor", floorRouter);

const studentsRouter = require('./routes/Students');
app.use("/student", studentsRouter);

const reservationRouter = require('./routes/Reservation');
app.use("/reservation", reservationRouter);

const confabRouter = require('./routes/Confab');
app.use("/confab", confabRouter);

db.sequelize.sync().then(async () => {
    const adminUser = await Users.findOne({ where: { type: 'Admin' } });

    if (!adminUser) {
        // Create admin user
        Users.create({
            name: 'Admin',
            username: 'superAdmin',
            password: 'capstone2023',
            type: 'Admin'
        }).then(() => {
            console.log('Admin user created');
        }).catch(error => {
            console.error('Error creating admin user:', error);
        });
    }

    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    });
})
