const express = require('express');
const router = express.Router();
const { Floor } = require('../models')
const { validateToken } = require("../middlewares/AuthMiddleware")

router.get('/', validateToken, async (req, res) => {
    const listOfFloors = await Floor.findAll()
    res.json(listOfFloors)
});

module.exports = router;