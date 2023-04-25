const express = require('express');
const router = express.Router();
const { Confab } = require('../models')
const { validateToken } = require("../middlewares/AuthMiddleware")

router.post('/', validateToken, async (req, res) => {
    const confab = req.body
    try {
        await Confab.create(confab);
        res.status(200).json({success: "Create Confab Successful"});
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

router.get('/all', validateToken, async (req, res) => {
    try {
        const listOfConfabs = await Confab.findAll()
        res.json(listOfConfabs)
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

router.get('/', validateToken, async (req, res) => {
    try {
        const listOfConfabs = await Confab.findAll({ where: { status: 'Open' } })
        res.json(listOfConfabs)
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

router.patch('/:id', validateToken, async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const confab = await Confab.findOne({ where: { id } });
        if (confab) {
            // Dynamically update the user object with the new data
            Object.keys(data).forEach(key => {
                confab[key] = data[key];
            });

            await confab.save();
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
        await Confab.destroy({ where: { id } });
        res.status(204).json({ success: "Deletion Successful" });
    } catch (err) {
        res.status(500).json({ error: err });
    };
});

module.exports = router;