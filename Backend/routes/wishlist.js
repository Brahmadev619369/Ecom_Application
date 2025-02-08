const {removeWishlist,addWishlist,getWishlist} = require("../controllers/wishlist")
const {Router} = require("express")
const router = Router()
const authMiddleware = require("../middleware/authMiddleware");

router.get("/get-wishlist",authMiddleware,getWishlist)
router.post("/add-wishlist",authMiddleware,addWishlist)
router.post("/remove-wishlist",authMiddleware,removeWishlist)

module.exports = router;