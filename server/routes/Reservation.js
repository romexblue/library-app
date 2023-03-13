const express = require('express');
const router = express.Router();
const { Reservation, ReservationStudent, Students } = require('../models')
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post('/', async (req, res) => {
    const { list, ...rec } = req.body; //separate student list from the request
    let newId;
    try {
        const newReservation = await Reservation.create(rec);
        newId = newReservation.id;

        for (let i = 0; i < list.length; i++) {
            const rfid = list[i];
            const student = await Students.findOne({ where: { rfid } });
            
            await ReservationStudent.create({ reservationId: newId, studentId: student.id});
        }
        res.json({success: "reservation successful"})
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: 'Reservation already exists' });
        } else {
            if(newId){
            await Reservation.destroy({
                where: { id: newId }
              });
            }
            console.error(error);
            res.status(500).json({ error: 'Error creating reservation. Please Try Again' });
        }
    }
})

module.exports = router;