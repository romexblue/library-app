const express = require('express');
const router = express.Router();
const { Students } = require('../models');
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

router.get('/find/:school_id', async (req, res) => {
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
        if (student) {
            res.json(student);
        } else {
            res.json({ error: "Student Not Found" })
        }
    } catch (err) {
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
        res.status(200).json({ success: "Transaction Successful" });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
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