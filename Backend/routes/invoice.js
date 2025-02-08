const {generateInvoice} = require("../utils/invoice")
const {Router} = require("express")
const router = Router();

router.get("/invoice/:orderId",generateInvoice)

module.exports =  router