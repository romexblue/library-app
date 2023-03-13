const {verify} = require('jsonwebtoken')

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");
    const userid = req.header("userId")
    const makestring = userid.toString();
    if (!accessToken) return res.json({error:"Not Authenticated!"});

    try{
        const validToken = verify(accessToken, makestring)
        
        if(validToken){
            return next();
        }
    } catch(err){
        return res.json({error: err})
    }
}

module.exports = {validateToken}