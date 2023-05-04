const express = require('express');
const router = express.Router();
const { Users } = require('../models')
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/AuthMiddleware');

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await Users.findOne({ where: { username: username, password: password } });

        if (!user) { res.json({ error: "Wrong password or username" }) }
        else {
            const secretkey = user.id.toString();
            const accessToken = sign(
                { username: user.username, id: user.id },
                secretkey
            )

            res.json({ accessToken: accessToken, userId: user.id, type: user.type })
            }   
    } catch (err) {
        res.json({ error: err })
    }
})

router.get('/admin-auth/:id', validateToken, async (req, res) => {
    try{
        const user_id = req.params.id;
        const user = await Users.findOne({
            where: {
                id: user_id,
            }
        });
        if (user) {
            res.json({ success: "User Verified", type: user.type })
        } else {
            res.json({ error : "Admin Not Verified" })
        }
    }catch(err){
        res.status(400).json({ error: "Internal Server Error" })
    }
})

router.get('/allow', validateToken, (req, res) => {
    res.json(req.data)
})

router.get('/all/:page', validateToken, async (req, res) => {
    try {
        const page = parseInt(req.params.page) || 1;
        const limit = 10;
        const offset= (page - 1) * limit;
        const listOfUsers = await Users.findAll({limit, offset});
        const count = await Users.count();
        res.json({listOfUsers, count});
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

router.patch('/:id', validateToken, async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const user = await Users.findOne({ where: { id } });
        if (user) {
            // Dynamically update the user object with the new data
            Object.keys(data).forEach(key => {
                user[key] = data[key];
            });

            await user.save();
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
        await Users.destroy({ where: { id } });
        res.status(204).json({ success: "Deletion Successful" });
    } catch (err) {
        res.status(500).json({ error: err });
    };
});

router.post('/', validateToken, async (req, res) => {
    const user = req.body
    try {
        await Users.create(user);
        res.status(200).json({success: "Create User Successful"});
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

module.exports = router;    