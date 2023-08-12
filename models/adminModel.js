const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const adminSchema = new mongoose.Schema({
    name:{
        type: String, 
        required: [true, "Cannot create user without name"]
    },
    email:{
        type: String, 
        required: [true, "Cannot create user without email"]
    },
    password:{
        type: String, 
        required: [true, "Password is necessary"]
    }
})


adminSchema.statics.login = async function(email, password){
    const admin = await this.findOne({email: email})
    if(admin){
        const data = await bcrypt.compare(password, admin.password)
        if(data){
            delete admin._doc.password
            return admin._doc
        }
        else
        throw new Error('Invalid email or password!')
    }
    else
    throw new Error("Invalid email or password!")
}

module.exports = new mongoose.model('admins', adminSchema)

