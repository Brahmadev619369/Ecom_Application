const multer = require("multer")
const path = require("path")
const {v4:uuid} = require("uuid")

// set up multer storage configuration 
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"..","uploads"))
    },
    filename:(req,file,cb)=>{
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        cb(null, `${baseName}-${uuid()}${ext}`);
    }
})

// Initialize multer with storage configuration and file size limit

const upload = multer({
    storage:storage,
    limits:{fileSize:1000000},
    fileFilter:(req,file,cb)=>{
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
})
module.exports = upload;