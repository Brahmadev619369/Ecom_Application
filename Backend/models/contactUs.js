const mongoose = require("mongoose")

const contactUsSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "User",
        require :true
    },
    name :{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    number:{
        type:Number,
        require:true
    },
    message:{
        type:String,
        require:true
    }
},{timestamps:true})

const Contact = mongoose.model("Contact",contactUsSchema)
module.exports = Contact;
