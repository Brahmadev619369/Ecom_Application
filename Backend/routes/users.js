const {Router} = require("express")
const router = Router();
const {registerUser,loginUser,
    accountActivation,userDetails,
    forgotPassword,resetPassword,getUsers,
    changeProfilePicture,updateUserDetails,adminRegister} = require("../controllers/users");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../configs/multer");


router.post("/register",registerUser)
router.post("/adminRegister",upload.single("image"),adminRegister)
router.post("/login", loginUser);
router.post("/register/activation/:activateToken",accountActivation);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetToken",resetPassword)
router.get("/profile-details",authMiddleware,userDetails)
router.post("/change-profile",authMiddleware,upload.single("image"),changeProfilePicture)
router.post("/edit-user",authMiddleware,updateUserDetails)
router.get("/get-users",authMiddleware,getUsers)
module.exports = router;