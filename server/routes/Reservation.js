const express = require('express');
const { Op } = require('sequelize');
const moment = require('moment');
const router = express.Router();
const { Reservation, ReservationStudent, Students, Confab } = require('../models')
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get('/requests/find-by/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findOne({
      where: { id },
      include: [
        {
          model: Students,
          attributes: ['school_id'],
          through: {
            attributes: [] // exclude join table attributes from the result
          }
        }
      ]
    });
    res.json({ reservation })
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.get('/requests/:confId/:status', async (req, res) => {
  try {
    const { confId, status } = req.params;
    const reservations = await Reservation.findAll({
      where: {
        ConfabId: confId,
        confirmation_status: status
      },
      include: [
        {
          model: Students,
          attributes: ['school_id'],
          through: {
            attributes: [] // exclude join table attributes from the result
          }
        }
      ]
    });
    res.json({ reservations })
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.get('/:confId/:date', async (req, res) => {
  if (!req.params.confId || !req.params.date) {
    res.status(500).json({ error: "Date and ConfabId is required" })
  }

  try {
    const { confId, date } = req.params;
    const reservations = await Reservation.findAll({
      where: {
        date: date,
        ConfabId: confId,
      },
      attributes: ['start_time', 'end_time'],
    });

    const availableSlots = [];
    let lastEndTime = moment('08:00:00', 'HH:mm:ss');

    reservations.forEach((reservation) => {
      const startTime = moment(reservation.start_time, 'HH:mm:ss');
      const endTime = moment(reservation.end_time, 'HH:mm:ss');

      if (lastEndTime.isBefore(startTime)) {
        availableSlots.push({
          start: lastEndTime.format('HH:mm:ss'),
          end: startTime.format('HH:mm:ss'),
        });
      }

      lastEndTime = moment.max(lastEndTime, endTime);
    });

    if (lastEndTime.isBefore(moment('19:00:00', 'HH:mm:ss'))) {
      availableSlots.push({
        start: lastEndTime.format('HH:mm:ss'),
        end: moment('19:00:00', 'HH:mm:ss').format('HH:mm:ss'),
      });
    }

    res.json({ availableSlots });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.post('/', validateToken, async (req, res) => {
  const { guestList, ...rec } = req.body; //separate guest list from the request
  let newId; //for record deletion if error in student list

  const start_time = moment(req.body.start_time, 'HH:mm:ss');
  const end_time = moment(req.body.end_time, 'HH:mm:ss');
  const date = req.body.date;
  const confID = req.body.ConfabId;

  try {

    const existingReservation = await Reservation.findOne({
      where: {
        ConfabId: confID,
        date: date,
        [Op.or]: [
          {
            start_time: {
              [Op.between]: [start_time.format('HH:mm:ss'), end_time.format('HH:mm:ss')],
            },
          },
          {
            end_time: {
              [Op.between]: [start_time.format('HH:mm:ss'), end_time.format('HH:mm:ss')],
            },
          },
          {
            [Op.and]: [
              {
                start_time: {
                  [Op.lte]: start_time.format('HH:mm:ss'),
                },
                end_time: {
                  [Op.gte]: end_time.format('HH:mm:ss'),
                },
              },
            ],
          },
        ],
      },
    });

    if (existingReservation) {
      const conflictingReservations = await Reservation.findAll({
        where: {
          ConfabId: confID,
          date: date,
          [Op.or]: [
            {
              start_time: {
                [Op.between]: [start_time.format('HH:mm:ss'), end_time.format('HH:mm:ss')],
              },
            },
            {
              end_time: {
                [Op.between]: [start_time.format('HH:mm:ss'), end_time.format('HH:mm:ss')],
              },
            },
            {
              [Op.and]: [
                {
                  start_time: {
                    [Op.lte]: start_time.format('HH:mm:ss'),
                  },
                  end_time: {
                    [Op.gte]: end_time.format('HH:mm:ss'),
                  },
                },
              ],
            },
          ],
        },
        include: [{
          model: Confab,
          attributes: ['name']
        }],
        raw: true,
        nest: true
      });

      const overlappingTimePeriods = conflictingReservations.map((reservation) => {
        const conflictingStart = moment.max(start_time, moment(reservation.start_time, 'HH:mm:ss')).format('HH:mm:ss');
        const conflictingEnd = moment.min(end_time, moment(reservation.end_time, 'HH:mm:ss')).format('HH:mm:ss');
        return {
          reservationId: reservation.id,
          conflictingStart: conflictingStart,
          conflictingEnd: conflictingEnd,
          ConfabName: reservation['Confab.name']
        }
      });
      res.status(400).json({
        'Conflicting reservations:': conflictingReservations,
        'Overlapping time periods:': overlappingTimePeriods
      })
    } else {
      const newReservation = await Reservation.create(rec);
      newId = newReservation.id; //take ID for record deletion if error in student info

      for (let i = 0; i < guestList.length; i++) {
        const school_id = guestList[i];
        const student = await Students.findOne({ where: { school_id } });
        await ReservationStudent.create({ reservationId: newId, studentId: student.id }); //add data to ReservationStudent
      }
      res.json({ success: `reservation successful. Reservation ID is ${newReservation.id}`, reservationId: newReservation.id })
    }
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'Reservation already exists' });
    } else {
      if (newId) {
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