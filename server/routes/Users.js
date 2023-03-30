const express = require('express');
const router = express.Router();
const { Users } = require('../models')
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/AuthMiddleware');

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try{
    const user = await Users.findOne({ where: { username: username, password: password } });

    if (!user) { res.json({ error: "Wrong password or username" }) }
    else {
        const secretkey = user.id.toString();
        const accessToken = sign(
            { username: user.username, id: user.id },
            secretkey
        )

        res.json({ accessToken: accessToken, userId: user.id, type: user.type })
    }}catch(err){
        res.json({error:err})
    }
})

router.get('/admin-auth/:id', validateToken, async (req, res) => {
    const user_id = req.params.id;
    const user = await Users.findOne({
        where: {
            id: user_id,
            type: 'Admin'
        }
    });
    if (user) {
        res.json({ success: "Admin Verified" })
    } else {
        res.json({ error: "Admin Not Verified" })
    }

})

router.get('/allow', validateToken, (req, res) => {
    res.json(req.data)
})

module.exports = router;    