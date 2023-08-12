const adminModel = require('../models/adminModel.js')
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel.js');


// create jwt
const maxAge = 30 * 60;
function createToken(email, name){
    const token =  jwt.sign({email, name, admin: true}, process.env.JWT_ADMIN_KEY, {
        expiresIn: maxAge
    })
    console.log(process.env.JWT_ADMIN_KEY)
    return token;
}


module.exports.login_get = (req, res)=>{
    res.render('adminViews/login')
}

module.exports.login_post = async(req, res)=>{
    const {email, password} = req.body
    if(!email || !password){
        res.status(401).send({status: false, error: "Please provide necessary information"})
        return;
    }

    try{
        const status = await adminModel.login(email, password);
        if(status){
            res.cookie('jwt_adm', createToken(email, password), {
                httpOnly: true, 
                maxAge: maxAge * 1000
            })
            res.json({status: true})
        }
    }
    catch(err){
        res.send({status:false, error: err.message})
    }
}

module.exports.get_home = async(req, res)=>{
    res.render('adminViews/home')
}

module.exports.get_users = async(req, res)=>{
    try{
        if(!req.adminDetails.admin){
            res.status(400).send({status: false, error: "Unauthorized path"})
            return;
        }
        const users = await userModel.getAllUsers();
        console.log(users)

        console.log('what is wrong')
        res.status(200).send({status: true, userdata: users})
    }
    catch(e){
        res.status(400).send(e.message)
    }
}



// module.exports.post_createUser = ()=>{}
module.exports.delete_deleteUser = async(req, res)=>{
    const {email} = req.body;
    try{
        console.log(email)
        if(email){
            const user = await userModel.blockUser(email)
            if(user.acknowledged){
                res.send({status: true})
            }
            else{
                throw new Error("Something went wrong.")
            }
        }   
        else{
            throw new Error("Please provide necessary information")
        }
    } 
    catch(err){
        res.status(400).json({status: false, error: err.message})
    }
}
module.exports.patch_updateUser = async(req, res)=>{
    let {name , email, ogEmail} = req.body;
    try{
        if(ogEmail && (name || email)){
            const updatedUser = await userModel.updateUser(email, name, ogEmail);
            if(updatedUser.acknowledged && updatedUser.modifiedCount){
                res.status(200).json({status: true})
            }
        }
        else{
            res.status(401).send("Please provide enought data to update the file")
        }
    }
    catch(err){
        res.status(402).send({status: false, error: err.message})
    }
}

module.exports.get_logout = (req, res)=>{
    res.clearCookie('jwt_adm')
    res.redirect('/admin/login')
}