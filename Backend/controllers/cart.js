const { default: mongoose } = require("mongoose")
const Cart = require("../models/cart")
const Products = require("../models/products")

const addToCart = async (req, res) => {
    const userId = req.user._id
    const { productId, size, quantity = 1 } = req.body
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }
 




    try {
        const product = await Products.find({_id:productId});
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const availableQty = product[0]?.inStock;


        if (!availableQty || availableQty === 0 || availableQty < quantity) {
            return res.status(400).json({
                message: "Not enough stock available!"
            })
        }


        let cart = await Cart.findOne({ userId })

        //if cart not exist
        if (!cart) {
            cart = new Cart({
                userId,
                items: {
                    [productId]: { [size]: quantity }
                }
            })

        } else {
            // cart already exist
            if (cart.items[productId]) {
                if (cart.items[productId][size]) {
                    const newQty = cart.items[productId][size] + quantity
                    if(newQty>availableQty){
                        return res.status(400).json({
                            message: "Not enough stock available!"
                        })
                    }

                    cart.items[productId][size] = newQty

                } else {
                    cart.items[productId][size] = quantity;
                }
            } else {
                cart.items[productId] = { [size]: quantity }
            }
            // some time mongoose not getting changes that why manually tell to him marks this changes
            cart.markModified("items");
        }

        await cart.save()

        res.status(200).json({
            message: "Item added to cart successfully",
            cart: cart.items
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const removeToCart = async (req, res) => {
    const userId = req.user._id
    const { productId, size, quantity = 1 } = req.body

    try {
        let cart = await Cart.findOne({ userId })
        if (!cart) {
            res.status(400).send({ message: "cart not found." })
        }

        if (cart.items[productId]) {
            if (cart.items[productId][size]) {
                cart.items[productId][size] -= quantity
            }
            if (cart.items[productId][size] === 0) {
                delete cart.items[productId][size];
            }

            if (Object.keys(cart.items[productId]).length === 0) {
                delete cart.items[productId]
            }

        } else {
            return res.status(400).json({ message: "Item not found in cart" });
        }

        if (Object.keys(cart.items).length === 0) {
            await Cart.deleteOne({ userId });
        }

        cart.markModified("items");

        await cart.save()

        res.status(200).json({
            message: "Item removed from cart successfully",
            cart: cart.items
        });

    } catch (error) {
        res.status(500).send({ error: error })
    }
}


const getCartItems = async (req, res) => {
    const userId = req.user._id

    try {
        const cartItems = await Cart.find({ userId: userId })
        res.status(200).json(cartItems)
        // console.log(cartItems);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }

}


const deleteCartItems = async (req, res) => {
    const userId = req.user._id
    const { productId, size } = req.body
    try {
        let cart = await Cart.findOne({ userId })

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        if (cart.items[productId]) {
            if (cart.items[productId][size]) {
                delete cart.items[productId][size]
            }

            if (Object.keys(cart.items[productId]).length === 0) {
                delete cart.items[productId];
            }
        } else {
            return res.status(400).json({ message: "Item not found in cart" });
        }

        if (Object.keys(cart.items).length === 0) {
            await Cart.deleteOne({ userId })
        }

        cart.markModified("items")

        await cart.save()

        return res.status("Items Removed.")
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    addToCart,
    getCartItems,
    removeToCart,
    deleteCartItems
}