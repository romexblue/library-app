const express = require('express');
const router = express.Router();
const { Students } = require('../models');
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get('/find/:school_id', validateToken, async (req, res) => {
    const school_id = req.params.school_id;
    const user = await Students.findOne({ where: { school_id } });
    if (user) {
        res.json(user);
    } else {
        res.json({ error: "User Not Found" })
    }
});

module.exports = router;