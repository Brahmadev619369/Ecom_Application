const {Router} = require("express")
const router = Router();
const {addToCart,getCartItems,removeToCart,deleteCartItems} = require("../controllers/cart")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/add-to-cart",authMiddleware,addToCart)
router.post("/remove-to-cart",authMiddleware,removeToCart)
router.get("/get-cart-items",authMiddleware,getCartItems)
router.post("/delete-to-cart",authMiddleware,deleteCartItems)

module.exports = router