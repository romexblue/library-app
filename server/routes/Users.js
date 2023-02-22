const express = require('express');
const router = express.Router();
const { Users } = require('../models')
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/AuthMiddleware');

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await Users.findOne({ where: { username: username, password: password } });

    if (!user) { res.json({ error: "Wrong password or username" }) }
    else {
        const accessToken = sign(
            { username: user.username, id: user.id }, 
            "secretpass"
        )

        res.json({accessToken: accessToken, userId: user.id})
    }
})

router.get('/allow', validateToken, (req, res)=>{
    res.json(req.data)
})

module.exports = router;    