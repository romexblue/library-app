const express = require('express');
const router = express.Router();
const { Records, Students } = require('../models')
const { validateToken } = require("../middlewares/AuthMiddleware")

router.get('/', validateToken, async (req, res) => {
    const listOfRecords = await Records.findAll()
    res.json(listOfRecords)
});


//for time in
router.post('/', validateToken, async (req, res) => {
    const { rfid, ...rec } = req.body;

    await Students.findAll({
        where: { rfid: rfid },
        include: {
            model: Records,
            where: { time_out: null }
        }
    }).then(async (records) => {
        if (records.length > 0) {
            res.json({ error: "You are currently Timed In. Please Time Out" });
        } else {
            await Records.create(rec);
            res.json(rec);
        }
    }).catch((error) => {
        res.json({ error: error });
    });

})

//for timeout
router.patch('/find/:school_id', validateToken, async (req, res) => {
    const rfid = req.params.school_id;
    const rec = req.body

    const user = await Students.findOne({ where: { rfid } }); //to get userId
    if (user) {
        try {
            const newRecord = await Records.update({
                time_out: rec.time_out
            }, {
                where: {
                    StudentId: user.id,
                    time_out: null
                },
                limit: 1
            })
            if (newRecord[0] === 1) {
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