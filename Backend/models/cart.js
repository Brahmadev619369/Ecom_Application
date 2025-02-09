const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: Object, required: true }, // Use an object for flexible nested structure
},{timestamps:true});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;



