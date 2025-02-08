const {contactUs} = require("../controllers/contactUs")
const {Router} = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const router = Router()

router.post("/contactUs",authMiddleware,contactUs)

module.exports = router;    