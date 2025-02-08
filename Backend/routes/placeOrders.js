const {placeOrdersAndMakePayment,checkStatus} = require("../controllers/placeOrders")
const {Router} = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = Router()

router.post("/pay",authMiddleware,placeOrdersAndMakePayment)
router.post("/status/:txnId", checkStatus);


module.exports = router;