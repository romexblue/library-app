const express = require('express');
const router = express.Router();
const { Students } = require('../models');
const { Op } = require('sequelize');
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get('/find/:school_id', validateToken, async (req, res) => {
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
        const limit = 10;
        const offset= (page - 1) * limit;
        const students = await Students.findAll({limit, offset});
        const count = await Students.count();
        res.json({students, count});
    } catch (error) {
        res.status(500).json({ error: "Internal Server Errror" })
    }
});

module.exports = router;