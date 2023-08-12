const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

module.exports.requireAuth = async(req, res, next)=>{
    console.log('what')
    let status = false;
    if(req.cookies.jwt){
        status = await jwt.verify(req.cookies.jwt, process.env.JWT_KEY);
    }
    if(status){
        const isFlag = await User.findOne({email: status.email})
        
        if(!isFlag || isFlag.flag) {
            status = false;
        }
        else{
            req.userDetails = status
            
        }
    }
    console.log(status)
    console.log(req.url);
    console.log(req.body)
    if(status && (req.url == '/login' || req.url == '/signin')){
        if(req.body.from == 'admin'){
            console.log("this is admin request better don't block it")
            next();
        }
        else
        res.redirect('/');
        return;
    }
    else if(req.url != '/login' && req.url != '/signin' && !status){
        res.redirect('/login')
        // res.end();
        return;
    }
    next();
}




