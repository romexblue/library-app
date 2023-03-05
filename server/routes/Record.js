const express = require('express');
const router = express.Router();
const { Records, Students } = require('../models')
const { validateToken } = require("../middlewares/AuthMiddleware")

router.get('/', async (req, res) => {
    const listOfRecords = await Records.findAll()
    res.json(listOfRecords)
});


//for time in
router.post('/', validateToken, async (req, res) => {
    const rec = req.body;
  
    Records.findAll({
        where: { 
            StudentId: rec.StudentId, // Replace 123 with the actual StudentId you want to query
            time_out: null 
         }
    }).then(async (records) => {
        if (records.length > 0) {
            res.json({error:"You are currently Timed In. Please Time Out"});
        } else {
            await Records.create(rec);
            res.json(rec);
        }
    }).catch((error) => {
        console.error(error);
    });
})

//for timeout
router.put('/find/:school_id', validateToken, async (req, res) => {
    const school_id = req.params.school_id;
    const rec = req.body  
    
    const user = await Students.findOne({ where: { school_id } }); //to get userId
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
            res.json({error:err})
        }
    } else {
        res.json({ error: "No existing record" })
    }

});

module.exports = router;