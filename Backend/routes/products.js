const {addProducts,fetchProducts,productDetails,deleteProduct} = require("../controllers/products")
const {Router} = require("express")
const router = Router()
const upload = require("../configs/multer")

router.post("/add-products",upload.array("image",4),addProducts)
router.get("/get-products",fetchProducts)
router.get("/:productId",productDetails)
router.delete("/:productId",deleteProduct)

module.exports = router