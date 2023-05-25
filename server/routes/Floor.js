const express = require('express');
const router = express.Router();
const { Floor } = require('../models')
const { validateToken } = require("../middlewares/AuthMiddleware")

router.post('/', validateToken, async (req, res) => {
    const floor = req.body
    try {
        await Floor.create(floor);
        res.status(200).json({success: "Create Floor Successful"});
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

router.get('/all', validateToken, async (req, res) => {
    try {
        const list1 = await Floor.findAll({
            where: {
                label: 'Main'
              },
            order: [['name', 'ASC']]
        })
        const list2 = await Floor.findAll({
            where: {
                label: 'Annex'
              },
            order: [['name', 'ASC']]
        })
        const listOfFloors = list1.concat(list2);
        res.json(listOfFloors)
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

router.get('/', validateToken, async (req, res) => {
    try {
        const listOfFloors = await Floor.findAll({ where: { status: 'Open' } })
        res.json(listOfFloors)
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

router.patch('/:id', validateToken, async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const floor = await Floor.findOne({ where: { id } });
        if (floor) {
            // Dynamically update the user object with the new data
            Object.keys(data).forEach(key => {
                floor[key] = data[key];
            });

            await floor.save();
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
        await Floor.destroy({ where: { id } });
        res.status(204).json({ success: "Deletion Successful" });
    } catch (err) {
        res.status(500).json({ error: err });
    };
});

module.exports = router;