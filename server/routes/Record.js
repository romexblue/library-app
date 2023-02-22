const express = require('express');
const router = express.Router();
const { Records } = require('../models')
const { validateToken } = require("../middlewares/AuthMiddleware")

router.get('/', async (req, res) => {
    const listOfRecords = await Records.findAll()
    res.json(listOfRecords)
});

router.post('/', validateToken, async (req, res) => {
    const rec = req.body;
    await Records.create(rec);
    res.json(rec);
})

module.exports = router;