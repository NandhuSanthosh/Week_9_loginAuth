const mongoose = require('mongoose');
const validate = require('validator');
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        minlength: [3, "Enter a valid name"],
        require: [true, "Please enter name"]
    }, 
    email: {
        type: String, 
        require: [true, "Please enter email"], 
        unique: true,
        lowercase: true,
        validate: [validate.isEmail, "Email not valid"]
    }, 
    password: {
        type: String, 
        required: [true, "Password not valid"],
    }, 
    profileUrl: {
        type: String, 
        default: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"
    },
    flag: {
        type: Boolean, 
        default: false
    }
})

userSchema.pre('save', async function(next){
    this.password = await bcrypt.hash(this.password, 10)
    next();
})

userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email: email});
    // console.log(user)
    if(user){
        if(user.flag){
            throw new Error("You are termporerly blocked from the platform.")
        }
        const result = await bcrypt.compare(password, user.password)
        if(!result){
            throw new Error('Email or Password not valid!')
        }
        return user;
    }
    throw new Error('Email or Password not valid')
}

userSchema.statics.updateUser = async function(email, name, ogEmail){
        const user = await this.findOne({email: ogEmail}, {_id: 0, name: 1, email: 1, profileUrl: 1, flag: 1});
        if(user){
            let updateQuery = {};
            if(email){
                updateQuery.email = email;
            }
            if(name){
                updateQuery.name = name;
            }
            console.log(updateQuery)
            const updatedUser = await this.updateOne({email: ogEmail}, { $set : updateQuery})
            return updatedUser;

        }
        else{
            throw new Error("No such user exists");
        }
}

userSchema.statics.blockUser = async function(email){
    const user = await this.updateOne({email}, {$set: {flag: true}})
    return  user;
}

userSchema.statics.getAllUsers = async function(){
    try {
        const users = await this.find({}, { "_id": 0, "name": 1, "email": 1, "flag": 1, "profileUrl": 1})
        return users;
    } catch (error) {
        throw error
    }
}


module.exports = new mongoose.model('user', userSchema);