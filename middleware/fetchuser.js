const jwt = require('jsonwebtoken');
const JWT_secret="shivansh is $ good m$n";

const fetchuser=(req,res,next)=>{
    const token=req.header('auth-token');
    if(!token){
        res.status(401).json({error:"Please enter a valid token "})

    }

    try {
        const data=jwt.verify(token,JWT_secret);
        req.user=data.user;
        next();
    } catch (error) {
        res.status(401).json({error:"Please enter a valid token "})
        
    }
}

module.exports=fetchuser;