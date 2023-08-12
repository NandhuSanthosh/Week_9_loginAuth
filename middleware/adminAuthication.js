const jwt = require("jsonwebtoken")

module.exports.adminAuth = async(req, res, next)=>{
    const token = req.cookies.jwt_adm;
    let status = false;
    try{
        if(token){
            status = await jwt.verify(token, process.env.JWT_ADMIN_KEY)
            if(status){
                req.adminDetails = status;
            }
        }
        
        if(status && req.url == '/login'){
            res.redirect('/admin/')
        }
        else if(status && req.url != '/login'){
            next()
        }
        else if(!status && req.url == '/login'){
            next();
        }
        else if(!status && req.url != '/login'){
            res.redirect('/admin/login')
        }
    }
    catch(e){
        res.status(500).send({status: false, error: e.message})
    }
}