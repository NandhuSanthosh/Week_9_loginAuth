const cloudinary = require('cloudinary');
const User = require('../models/userModel')
const validator = require('validator')
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const bycrpt = require('bcrypt')

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

// error handling
function errorHandler(err){
    // console.log(err)
    console.log(err.message)
    let errors = {};
    // duplicate email error
    if(err.code === 11000){
        errors.email = "This email is associated with another account."
    }

    // validation error
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            if(properties && errors)
            errors[properties.path] = properties.message;
        })
    }

    return errors;
}

// create a jwt token
const maxAge = 3 * 60 * 60 * 24
function createToken(name, email, profileUrl){
    return jwt.sign({
        name, email, profileUrl
    }, process.env.JWT_KEY, {
        expiresIn: maxAge 
    })
}


module.exports.signin_get = (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.render('login-signin', {page: 'Signin'})
}
module.exports.login_get = (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.render('login-signin', {page: 'Login'})
}


module.exports.signin_post = async(req, res) => {
    console.log('from', req.body)
    try{
        if(req.files){
            const result =  await cloudinary.v2.uploader.upload(req.files.url.tempFilePath) 
            req.body.profileUrl = result.url;
        }
        
        const user = await User.create(req.body)
        if(req.body.from != 'admin')
        res.cookie('jwt', createToken(user.name, user.email, user.profileUrl), {
            httpOnly: true, 
            maxAge: maxAge * 1000
        })
        console.log('here')
        res.status(201).json({status: true});
        // res.send(req.body.profileUrl)

    }
    catch(err){
        const error = errorHandler(err);
        res.status(400).json({status: false, error})
        // res.send(err.message)
    }
}

module.exports.login_post = async(req, res) => {
        // console.log(req.body)
        try {
            
            if(!req.body.email || !req.body.password){
                throw new Error('Enter both email and password to login')
            }

            const user = await User.login(req.body.email, req.body.password);
            res.cookie("jwt" , createToken(user.name, user.email, user.profileUrl))
            res.status(201).json({status: true});
            
            
        } catch (err) {
            res.status(406).send({ status: false,  error: err.message})
        }
}

module.exports.logout_get = (req, res)=>{
    res.clearCookie('jwt')
    res.redirect('/login')
}
