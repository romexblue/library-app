const express = require('express');
const router = express.Router();
const { Students } = require('../models');
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get('/find/:school_id', validateToken, async (req, res) => {
    const rfid = req.params.school_id;
    const student = await Students.findOne({ where: { rfid } });
    if (student) {
        res.json(student);
    } else {
        res.json({ error: "Student Not Found" })
    }
});

module.exports = router;