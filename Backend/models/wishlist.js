const mongoose = require("mongoose")

const wishlistScheme = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    products:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Products"
        }
    ]
})


const Wishlist = mongoose.model("Wishlist",wishlistScheme)
module.exports = Wishlist