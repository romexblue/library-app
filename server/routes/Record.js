const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Records, Students, Floor } = require('../models')
const { validateToken } = require("../middlewares/AuthMiddleware")

router.get('/stats/:year', validateToken, async (req, res) => {
    const { year } = req.params;
    try {
        const records = await Records.findAll({
            where: {
                time_in: { [Op.not]: null },
                time_out: { [Op.not]: null },
                date: { [Op.startsWith]: `${year}-` }
            }
        });
        let totalTime = 0;
        const monthData = {};
        for (let i = 0; i < records.length; i++) {
            const date = new Date(records[i].date);
            const month = date.toLocaleString('default', { month: 'long' });
            const timeInMs = new Date(`1970-01-01T${records[i].time_in}Z`).getTime();
            const timeOutMs = new Date(`1970-01-01T${records[i].time_out}Z`).getTime();
            const diffMs = timeOutMs - timeInMs;
            totalTime += diffMs;
            if (!monthData[month]) {
                monthData[month] = { totalTime: 0, count: 0 };
            }
            monthData[month].totalTime += diffMs;
            monthData[month].count++;
        }
        const totalAverageMs = totalTime / records.length;
        const totalAverageTime = formatTime(totalAverageMs);
        const monthAverages = {};
        for (const month in monthData) {
            const { totalTime, count } = monthData[month];
            const monthAverageMs = totalTime / count;
            monthAverages[month] = formatTime(monthAverageMs);
        }
        res.json({ totalAverage: totalAverageTime, ...monthAverages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//convert millisecond to HH:mm:ss
function formatTime(timeMs) {
    const hours = Math.floor(timeMs / (1000 * 60 * 60));
    const minutes = Math.floor((timeMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeMs % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

//for time in
router.post('/', validateToken, async (req, res) => {
    try {
        const rec = req.body;

        const floor = await Floor.findByPk(req.body.FloorId);
        if (floor.current_count === floor.max_capacity - 1) {
            await floor.update({ status: "Full" }) //set to close if it is full capacity
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