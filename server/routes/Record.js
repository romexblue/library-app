const express = require('express');
const router = express.Router();
const moment = require('moment');
const { Op, Sequelize } = require('sequelize');
const { Records, Students, Floor } = require('../models')
const { validateToken } = require("../middlewares/AuthMiddleware")

router.get('/stats/:startDate/:endDate/:college?', async (req, res) => {
    try {
        const startDate = req.params.startDate;
        const endDate = req.params.endDate;
        const college = req.params.college;
        // Query the Records table for all records in the selected date range where both time_in and time_out are not null
        const records = await Records.findAll({
            where: {
                date: {
                    [Op.between]: [startDate, endDate]
                },
                time_in: {
                    [Op.not]: null
                },
                time_out: {
                    [Op.not]: null
                }
            },
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('Records.id')), 'count'],
                [Sequelize.fn('AVG', Sequelize.literal('TIME_TO_SEC(TIMEDIFF(time_out, time_in))')), 'averageStayTime'],
                [Sequelize.fn('MAX', Sequelize.literal('TIME_TO_SEC(TIMEDIFF(time_out, time_in))')), 'highestStayTime'],
                [Sequelize.fn('MIN', Sequelize.literal('TIME_TO_SEC(TIMEDIFF(time_out, time_in))')), 'lowestStayTime']
            ],
            include: [
                {
                    model: Students,
                    attributes: [],
                    where: college ? { college: college } : {}
                },
                {
                    model: Floor,
                    attributes: ['name']
                }
            ],
            group: ['Records.FloorId'],
            raw: true
        });

        // Calculate the overall statistics
        const overallCount = records.reduce((total, record) => total + record.count, 0);
        const overallStayTime = records.reduce((total, record) => total + record.averageStayTime * record.count, 0) / overallCount;
        const overallHighestStayTime = records.reduce((maxStayTime, record) => record.highestStayTime > maxStayTime ? record.highestStayTime : maxStayTime, 0);
        const overallLowestStayTime = records.reduce((minStayTime, record) => record.lowestStayTime < minStayTime || minStayTime === 0 ? record.lowestStayTime : minStayTime, 0);

        res.json({
            overall: {
                count: overallCount,
                averageStayTime: overallStayTime,
                highestStayTime: overallHighestStayTime,
                lowestStayTime: overallLowestStayTime
            },
            floors: records
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while processing your request'
        });
    }
});

//convert millisecond to HH:mm:ss
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

//for time in
router.post('/', validateToken, async (req, res) => {
    try {
        const rec = req.body;

        const floor = await Floor.findByPk(req.body.FloorId);
        if (floor.current_count === floor.max_capacity - 1) {
            await floor.update({ status: "Full" }) //set to full if it is full capacity
        }

        const stud = await Students.findOne({
            where: {
                school_id: rec.StudentSchoolId
            },
            include: {
                model: Records,
                where: { time_out: null }
            }
        })

        if (stud) {
            res.json({ error: "You are currently Timed In. Please Time Out" })
        } else {
            await Records.create(rec);
            await Floor.increment('current_count', { where: { id: req.body.FloorId } });
            res.json(rec);
        }
    } catch (err) {
        res.status(400).json({ err: "Internal Server Error" })
    }
})

//for timeout
router.patch('/find/:school_id', validateToken, async (req, res) => {
    const rfid = req.params.school_id;
    const rec = req.body

    const user = await Students.findOne({
        where: {
            [Op.or]: [
                { school_id: rfid },
                { rfid: rfid }
            ]
        }
    }); //to get userId
    if (user) {
        try {
            const findRecord = await Records.findOne({ //find record to get floor id
                where: {
                    StudentSchoolId: user.school_id,
                    time_out: null
                },
                limit: 1
            })
            if (findRecord) {
                await Records.update({ //update record for timeout
                    time_out: rec.time_out
                }, {
                    where: {
                        StudentSchoolId: user.school_id,
                        time_out: null
                    },
                    limit: 1
                })

                await Floor.decrement('current_count', { where: { id: findRecord.FloorId } }); //decrement current count

                const floor = await Floor.findByPk(findRecord.FloorId); //check the capacity
                if (floor.current_count < floor.max_capacity) {
                    await floor.update({ status: "Open" }) //open if not at capacity
                }

                res.json({ success: "Time Out Successful" });
            } else {
                res.json({ error: "Not Timed In" });
            }
        } catch (err) {
            res.json({ error: err })
        }
    } else {
        res.json({ error: "No existing record" })
    }

});

module.exports = router;