const { default: mongoose } = require("mongoose");
const Review = require("../models/review")
const {uploadOnCloudinary,deleteProfileOnCloudinary} = require("../utils/cloudinary")

const addReview = async (req, res) => {
    const userId = req.user._id;
    const { review, rating, productId } = req.body;
    const image = req.file?.path;
console.log(image);

    if (!review) {
        return res.status(400).send({ error: "Review is required" });
    }

    if (!rating) {
        return res.status(400).send({ error: "Rating is required" });
    }

    const imgDetails = await uploadOnCloudinary(image);
    console.log(imgDetails);
    

    try {
        // Use a different variable for the created review
        const reviewResponse = await Review.create({
            userId,
            productId: new mongoose.Types.ObjectId(productId),
            review,
            rating,
            reviewImg: imgDetails?.url,
            reviewPubId: imgDetails?.public_id
        });

        // console.log("reviewResponse",reviewResponse);
        
        // Use res for the Express response
        res.status(200).send({ msg: "Review added successfully", review: reviewResponse });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};


const getReview = async(req,res) =>{
    // const userId = req.user._id
    const {productId} = req.params

    try {
        const review = await Review.find({productId}).populate("userId").sort({"createdAt":-1})
        
        res.status(200).send(review)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}


const editReview = async(req,res) =>{
    const { review, rating } = req.body;
    const image = req.file?.path;
    const {reviewId} = req.params
    
    if (!review) {
        return res.status(400).send({ error: "Review is required" });
    }

    if (!rating) {
        return res.status(400).send({ error: "Rating is required" });
    }

    const imgDetails = await uploadOnCloudinary(image);

    try {
        const oldReview = await Review.findById(reviewId)

        const UpdateTo = {
            review : review,
            rating : rating,
            reviewImg: imgDetails?.url,
            reviewPubId: imgDetails?.public_id
        }
        const respose = await Review.findByIdAndUpdate(reviewId,UpdateTo,{new:true})

        if(respose.status === 200){
            deleteProfileOnCloudinary(oldReview?.reviewPubId)
        }

        return res.status(200).send({
            data : respose,
            msg:"Review Successfully Updated"
        })
    } catch (error) {
        return res.status(500).send({
            error:error
        })
    }
}


// delete the review
const deleteReview = async(req,res) =>{
    const {reviewId} = req.params

    try {
        const response = await Review.findByIdAndDelete(reviewId)

        return res.status(200).send({
            msg : "Review Deleted Sucessfully."
        })
        
    } catch (error) {
        return res.status(500).send({error:error})
    }
}


module.exports = {
    addReview,
    getReview,
    editReview,
    deleteReview
};
