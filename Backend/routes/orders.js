const {Router} = require("express")
const router = Router()
const {myOrders,orderDetails,allOrders,adminOrder} = require("../controllers/orders")
const authMiddleware = require("../middleware/authMiddleware")

router.get("/myOrders",authMiddleware,myOrders)
router.get("/:orderId",authMiddleware,orderDetails)  // add authmid
router.get("/admin/orders",authMiddleware,adminOrder)

module.exports = router