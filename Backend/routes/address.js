const {Router} = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const router = Router()
const {addAddress,getAddress,deleteAddress} = require("../controllers/address")

router.post("/addAddress",authMiddleware,addAddress)
router.get("/getAddress",authMiddleware,getAddress)
router.delete("/:addressId",authMiddleware,deleteAddress)
module.exports = router