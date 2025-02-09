
const PlaceOrders = require("../models/placeOrders")

const myOrders = async(req,res) =>{
    const userId = req.user._id
    console.log("hello bhai myorder");

    try {
        const orders = await PlaceOrders.find({userId}).sort({orderDate:-1})
        // console.log(orders);
        return res.status(200).send(orders)
        
    } catch (error) {
        return res.status(500).send({error: error})
    }
}

const orderDetails = async(req,res) =>{

    const {orderId} = req.params; 
    console.log(orderId);    
    

    try {
        const response = await PlaceOrders.find({orderId})
        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send({error: error})
    }

}

// const allOrders = async (req, res) => {
//     console.log("hello bhai");
    
//     try {
//         const orders = await PlaceOrders.find().sort({ orderDate: -1 });
//         return res.status(200).json(orders);
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };



const adminOrder = async(req,res) =>{
    console.log("HELLO ADMIN");

   try {
    const orders = await PlaceOrders.find().sort({orderDate:-1})
    return res.status(200).json(orders)
    
   } catch (error) {
    return res.status(500).json({ error: error.message });
   }
}



module.exports = {
    myOrders,
    orderDetails,
    adminOrder
}