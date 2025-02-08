const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    role: {
        type:String,
        enum:["User","Admin","Worker"],
        default:"User"
    },
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    mobile:{
        type:Number,
      
    },
    password:{
        type:String,
        require:true
    },
    profileURL: {
        type:String,
        default:"https://res.cloudinary.com/dfmrenz0g/image/upload/v1725126444/profile_e0ehtz.png"
    },
    profile_public_id :{
        type:String
    },
    activationToken:{
        type:String
    },
    activationTokenExpiry:{
        type:Date
    },
    isActivated :{
        type:Boolean,
        default:false
    },
    resetToken :{
        type:String
    },
    resetTokenExpiry:{
        type:Date
    }
},{timestamps:true})


const User = mongoose.model("User",userSchema)

module.exports = User;