const express = require('express');
const { Op } = require('sequelize');
const moment = require('moment');
const router = express.Router();
const { Reservation, ReservationStudent, Students, Confab } = require('../models')
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get('/requests/find-by/:id', validateToken, async (req, res) => {
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

router.patch('/requests/find-by/:id', validateToken, async (req, res) => {
  const reservationId = req.params.id;
  const { confirmed_by, confirmation_status } = req.body;

  try {
    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    await reservation.update({ confirmed_by: confirmed_by, confirmation_status: confirmation_status });
    return res.status(200).json({ success: 'Reservation updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

router.get('/requests/:confId/:status/:date/:page', validateToken, async (req, res) => {
  try {
    const { confId, status, date, page } = req.params;
    const limit = 10; // limit number of records per page
    const offset = (page - 1) * limit; // calculate offset based on current page
    const reservations = await Reservation.findAndCountAll({
      where: {
        ConfabId: confId,
        confirmation_status: status,
        date: date
      },
      include: [
        {
          model: Students,
          attributes: ['school_id'],
          through: {
            attributes: [] // exclude join table attributes from the result
          }
        }
      ],
      limit: limit,
      offset: offset
    });
    const pageCount = Math.ceil(reservations.count / limit); // calculate number of pages
    res.json({ reservations: reservations.rows, pageCount: pageCount })
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
      attributes: ['start_time', 'end_time', 'confirmation_status'],
      order: [['start_time', 'ASC']]
    });

    // const availableSlots = [];
    // let lastEndTime = moment('08:00', 'HH:mm');

    // reservations.forEach((reservation) => {
    //   const startTime = moment(reservation.start_time, 'HH:mm');
    //   const endTime = moment(reservation.end_time, 'HH:mm');

    //   if (lastEndTime.isBefore(startTime)) {
    //     availableSlots.push({
    //       start: lastEndTime.format('HH:mm'),
    //       end: startTime.format('HH:mm'),
    //     });
    //   }

    //   lastEndTime = moment.max(lastEndTime, endTime);
    // });

    // if (lastEndTime.isBefore(moment('19:00', 'HH:mm'))) {
    //   availableSlots.push({
    //     start: lastEndTime.format('HH:mm'),
    //     end: moment('19:00', 'HH:mm').format('HH:mm'),
    //   });
    // }

    res.json({ reservations });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});


router.post('/', async (req, res) => {
  const { guestList, ...rec } = req.body; //separate guest list from the request
  let newId; //for record deletion if error in student list

  const start_time = moment(req.body.start_time, 'HH:mm:ss');
  const end_time = moment(req.body.end_time, 'HH:mm:ss');
  const date = req.body.date;
  const confID = req.body.ConfabId;
  const repId = req.body.representative_id;

  try {

    const existingRep = await Reservation.findOne({
      where: {
        representative_id: repId,
        date: date,
      }
    });
  
    if (existingRep) {
      return res.status(400).json({ error: 'No double booking allowed' });
    }

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
        await ReservationStudent.create({ reservationId: newId, StudentSchoolId: student.school_id }); //add data to ReservationStudent
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
      res.status(500).json({ error: 'Error creating reservation. Please Try Again' });
    }
  }
})

module.exports = router;