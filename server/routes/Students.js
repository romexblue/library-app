const express = require('express');
const router = express.Router();
const { Students } = require('../models');
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get('/find/:schoold_id', validateToken, async (req, res) => {
    const schoold_id = req.params.schoold_id;
    const user = await Students.findOne({ where: { schoold_id } });
    if (user) {
        res.json(user);
    } else {
        res.json({ error: "User Not Found" })
    }
});

module.exports = router;