const {Router} = require("express")
const router = Router()
const {chatbotController} = require("../controllers/chatbot")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/chatbot",authMiddleware,chatbotController)

module.exports = router