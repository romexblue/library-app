const express = require('express');
const router = express.Router();
const { Students, Records } = require('../models');
const { Op, Sequelize } = require('sequelize');
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get('/all/college', async (req, res) => {
    try {
        const uniqueColleges = await Students.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('college')), 'college']
            ]
        })
        res.json(uniqueColleges)
    } catch (err) {
        console.error(err)
        res.json({ error: err })
    }
});

//find student by id
router.get('/find-one/:school_id', async (req, res) => {
    try {
        const rfid = req.params.school_id;
        const student = await Students.findOne({
            where: {
                [Op.or]: [
                    { rfid: rfid },
                    { school_id: rfid }
                ]
            }
        });
        res.json(student)
    } catch (err) {
        res.status(400).json({ error: err })
    }
});

//for entry-exit route only
router.get('/find/:school_id', async (req, res) => {
    try {
        let rfid = req.params.school_id;
        if (rfid.startsWith("00")) {
            rfid = rfid.slice(2);
        }
        const student = await Students.findOne({
            where: {
                [Op.or]: [
                    { rfid: rfid },
                    { school_id: rfid }
                ]
            }
        });
        if (student) {
            const findRecord = await Records.findOne({ //find record to get floor id
                where: {
                    StudentSchoolId: student.school_id,
                    time_out: null
                },
                limit: 1
            })
            if (findRecord) {
                res.json({ error: "You are currently Timed In. Please Time Out" })
            } else {
                res.json({ student })
            }
        } else {
            res.json({ error: "No Record Found" })
        }
    } catch (err) {
        console.error(err)
        res.status(400).json({ error: err })
    }
});

router.get('/all/:page', validateToken, async (req, res) => {
    try {
        const page = parseInt(req.params.page) || 1;
        const limit = 7;
        const offset = (page - 1) * limit;
        const students = await Students.findAll({ limit, offset, order: [['last_name', 'ASC']] });
        const count = await Students.count();
        res.json({ students, count });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Errror" })
    }
});

router.post('/', validateToken, async (req, res) => {
    const student = req.body
    try {
        await Students.create(student);
        res.status(200).json({ success: "Create Student Successful" });
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

router.put('/', validateToken, async (req, res) => {
    const student = req.body
    try {
        await Students.upsert(student);
        res.status(200).json({ success: "Patron Registration Successful" });
    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
});

router.patch('/:id', validateToken, async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const student = await Students.findOne({ where: { school_id: id } });
        if (student) {
            // Dynamically update the user object with the new data
            Object.keys(data).forEach(key => {
                student[key] = data[key];
            });

            await student.save();
            res.status(200).json({ success: "Update Success" })
        } else {
            res.status(404).json({ error: "Not Found" })
        }
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

router.delete('/:id', validateToken, async (req, res) => {
    const { id } = req.params
    try {
        await Students.destroy({ where: { school_id: id } });
        res.status(204).json({ success: "Deletion Successful" });
    } catch (err) {
        res.status(500).json({ error: err });
    };
});

module.exports = router;