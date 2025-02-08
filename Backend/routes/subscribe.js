const {getSubscribeEmail,
    sendMsgToSubscriber
} = require("../controllers/subscribe")
const {Router}  = require("express")
const router = Router()
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../configs/multer");


router.post("/subscribe",getSubscribeEmail)
router.post("/subscriber-msg",authMiddleware,upload.single("image"), sendMsgToSubscriber)

module.exports = router