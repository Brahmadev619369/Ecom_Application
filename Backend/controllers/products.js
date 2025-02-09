const Products = require("../models/products");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const moment = require("moment")

const addProducts = async (req, res) => {
    const { name, description, price, mrp, sizes, category, subCategory, bestSeller,inStock } = req.body;
    if (!name || !description || !price || !mrp || !sizes || !category || !subCategory || !bestSeller || !inStock) {
        return res.status(400).send({ error: "All fields are require." })
    }

    if (!req.files) {
        return res.status(400).send({ error: "Atleast one image require." })
    }

    if (!req.files.length > 4) {
        return res.status(400).send({ error: "only four images are allowed." })
    }
    try {
        let imgUrl = []
        for (const file of req.files) {
            const imgDetails = await uploadOnCloudinary(file.path)
            imgUrl.push(imgDetails.url);

        }


        const response = await Products.create({
            name: name,
            description: description,
            price: price,
            Mrp: mrp,
            sizes: sizes,
            category: category,
            subCategory: subCategory,
            bestseller: bestSeller,
            image: imgUrl,
            inStock :inStock
        })

        res.status(200).send({
            message: "Product Successfully Added.",
            data: response
        })

    } catch (error) {
        res.status(500).send({
            error: error
        })
    }
}


const fetchProducts = async(req,res) =>{
    
    
    try {
        const response = await Products.find().sort({"createdAt":-1})
        console.log(response);
        
        return res.status(200).send(response)

    } catch (error) {
        return res.status(500).send({
            error:error
        })
    }
}


const productDetails = async(req,res) =>{
    const {productId} = req.params
    try {
        const response = await Products.findById(productId)
        return res.status(200).send(response)
        
    } catch (error) {
        return res.status(500).send({
            error:error
        })
    }
}

const deleteProduct = async(req,res) =>{
    const {productId} = req.params

    try {
        const response = await Products.findByIdAndDelete(productId)
        return res.status(200).send({response,msg:"Product Deleted."})
        
    } catch (error) {
        return res.status(500).send({
            error:error
        })
    }
}

module.exports = {
    addProducts,
    fetchProducts,
    productDetails,
    deleteProduct
}