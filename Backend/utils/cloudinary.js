const cloudinary = require('cloudinary').v2;
const fs = require("fs")

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async(localFilePath) =>{
    try {
        if(!localFilePath){
            return null
        }

        // upload on cloud
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"image"
        })

        fs.unlinkSync(localFilePath)   // after successful uploded on cloud

        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)  // if failed then remove it
        return null
    }
}


const deleteProfileOnCloudinary = async(publicId) =>{
    try {
        if(!publicId){
            return null
        }

        await cloudinary.uploader.destroy(publicId,{
            resource_type:"image"
        })
    } catch (error) {
        console.log(error);
        
    }
}


module.exports = {uploadOnCloudinary,deleteProfileOnCloudinary}