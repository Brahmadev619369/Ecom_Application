const Wishlist = require("../models/wishlist")


const getWishlist = async(req,res) =>{
    const userId = req.user._id;
    console.log(userId);
    

   try {
    const wishlist = await Wishlist.findOne({userId}).populate("products")
console.log("gte",wishlist);

    return res.status(200).send(wishlist)
   } catch (error) {
    return res.status(500).send({
        error:error
    })
   }
}


const addWishlist = async(req,res) =>{
    const {productId} = req.body;
    const userId = req.user._id;

    try {
        let wishlist = await Wishlist.findOne({userId:userId})
console.log(wishlist);

        if(!wishlist){
            wishlist = new Wishlist({
                userId,products:[productId]
            })
        }else if(!wishlist.products.includes(productId)){
            wishlist.products.push(productId)
        }else{
            return res.status(400).send({
                message:"Product already in wishlist."
            })
        }

       await wishlist.save()
        console.log(wishlist);
        return res.status(200).send(wishlist)
    } catch (error) {
        return res.status(500).send({
            error:error
        })
    }
}


const removeWishlist = async(req,res) =>{
    const {productId} = req.body;
    const userId = req.user._id

    try {
        let wishlist = await Wishlist.findOne({
            userId:userId
        })

        if(wishlist){
            wishlist.products = wishlist.products.filter((id)=>id.toString() !== productId)
            await wishlist.save()
        }

        return res.status(200).send(wishlist)

    } catch (error) {
        return res.status(500).send({
            error:error
        })
    }
}



module.exports  = {
    getWishlist,
    addWishlist,
    removeWishlist
}