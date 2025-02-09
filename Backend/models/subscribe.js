const mongoose = require("mongoose");

const subscribeScheme = mongoose.Schema({
    email:{
        type:String,
        require:true
    }
},{timestamps:true})


const Subscribe = mongoose.model("Subscribe",subscribeScheme)

module.exports = Subscribe