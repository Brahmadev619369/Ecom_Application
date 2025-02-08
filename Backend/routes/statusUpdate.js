const {Router} = require("express")
const router = Router()
const {updateOrderStatus , verifyStatus} = require("../controllers/statusUpdate")

router.post("/update-status",(req,res)=>{
    updateOrderStatus(req,res,req.app.get("io"))
})

router.post("/verify-status",(req,res)=>{
    verifyStatus(req,res,req.app.get("io"))
})

module.exports = router