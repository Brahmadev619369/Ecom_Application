const {addReview, getReview, editReview, deleteReview} = require("../controllers/review")
const {Router} = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = Router();
const upload = require("../configs/multer")

router.post("/review",authMiddleware,upload.single("image"),addReview)
router.get("/get-review/:productId",getReview)
router.put("/review/:reviewId",authMiddleware,upload.single("image"),editReview)
router.delete("/review/:reviewId",authMiddleware,deleteReview)

module.exports = router;
