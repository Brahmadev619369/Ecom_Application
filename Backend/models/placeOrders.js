const mongoose = require("mongoose")

const orderPlaceScheme = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref : "User",
        require:true
    },
    orderId:{
        type:String
    },
    items:{
        type:Object,
        require:true
    },
    address:{
        type:Object,
        require:true
    },
    totalAmount :{
        type:Number,
        require:true
    },
    orderStatus:{
        type:String,
        enum: ['Order Placed', 'Order Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'],
        default:"Order Placed"
    },
    orderDate : {
        type:Date,
        default:Date.now()
    },
    paymentStatus:{
        type:Boolean,
        default:false
    },
    otp:{
        type:String
    },
    qrcode:{
        type:String
    }
},{timestamps:true})

const PlaceOrders = mongoose.model("PlaceOrders",orderPlaceScheme)

module.exports = PlaceOrders;