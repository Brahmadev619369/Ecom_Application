const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    userId :{
        type:mongoose.Schema.Types.ObjectId,
        ref : "User",
        require: true
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        require: true
    },
    review:{
        type:String,
        require:true
    },
    rating : {
        type:Number,
        require:true
    },
    reviewImg :{
        type:String
    },
    reviewPubId:{
        type:String
    }
},{timestamps:true});


const Review = mongoose.model("Review",reviewSchema)

module.exports = Review