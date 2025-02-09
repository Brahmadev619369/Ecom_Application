import React, { useState, useContext } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import "./additems.css"
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../../loader/Loader';
import { Navigate } from 'react-router-dom'
import { storeContext } from '../../context/context'

function AddItems() {
    const initialProductData = {
        name: "",
        price: "",
        mrp: "",
        description: "",
        images: [],
        category: "Men",
        subCategory: "Topwear",
        inStock: ""
    };

    const [productData, setProductData] = useState(initialProductData);


    const [loader, setLoader] = useState(false)
    const [bestSeller, setBestSeller] = useState(false)
    const [sizes, setSizes] = useState([])
    const [previewImg, setPreviewImg] = useState([])
    const { auth } = useContext(storeContext)

    if (auth?.role === "Worker") {
        return <Navigate to="/login" />
    }

    // console.log(productData);



    const handleToFileChange = (e) => {
        const files = Array.from(e.target.files)
        if (files.length > 4) {
            alert("You can only upload up to 4 images.")
            return
        }

        // Clear previous image previews to avoid memory leaks
        previewImg.forEach((url) => URL.revokeObjectURL(url));

        // set images data
        setProductData({
            ...productData, images: files
        })

        // set imges for preview
        const imgPreview = files.map((img) => URL.createObjectURL(img))
        setPreviewImg(imgPreview)
    }

    const handleToChange = (e) => {
        const { name, value } = e.target
        setProductData({
            ...productData,
            [name]: value
        })
    }
    // prepare data and submit

    const handleToSubmit = async (e) => {
        e.preventDefault()
        setLoader(true)
        const data = new FormData()
        data.append("name", productData.name)
        data.append("price", productData.price)
        data.append("mrp", productData.mrp)
        data.append("description", productData.description)
        data.append("category", productData.category)
        data.append("subCategory", productData.subCategory)
        data.append("bestSeller", bestSeller)
        data.append("inStock", productData.inStock)

        sizes.forEach((size) => data.append("sizes[]", size))

        productData.images.forEach((image) => data.append("image", image))

        try {
            const response = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/products/add-products`, data)
            toast.success(response.data.message);
            console.log(response.data.message);
            setProductData(initialProductData);
            setLoader(false)


        } catch (error) {
            console.log(error.response.data.error);
            setLoader(false)
            toast.error(error.response.data.error);
            console.log(error);

        }
    }




    return (
        <div className='addItemsMainContainer'>
            {
                loader && <Loader />
            }
            <div className="heading">
                <div className="line1"></div>
                <h2 className='playfair-display-font'>Add Products</h2>
                <div className="line1"></div>
            </div>

            <ToastContainer />
            <div className="addItems">
                <form className="items" onSubmit={handleToSubmit}>
                    <div className="images flex-col">
                        <label htmlFor="">Upload Images</label>
                        <input type="file"
                            accept='image/*'
                            multiple
                            onChange={handleToFileChange}
                            id='images'
                            hidden />

                        <label htmlFor="images" className='imgUploader'>
                            <div className="sizetext">Each image size should be less than 1MB</div>
                            <FaCloudUploadAlt />
                        </label>
                        <div className="previewImgs">
                            {
                                previewImg.map((img, index) => {
                                    return (
                                        <div key={index} className="previewimg">
                                            <img src={img} alt="" />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className="name flex-col">
                        <label htmlFor="">Product Title</label>
                        <input type="text" name='name' value={productData.name} onChange={handleToChange} />
                    </div>

                    <div className="decription flex-col">
                        <label htmlFor="">Description</label>
                        {/* <input type="textarea" name='description' value={productData.description} /> */}
                        <textarea name='description' value={productData.description} onChange={handleToChange} />
                    </div>

                    <div className="sizesContainer flex-col">
                        <label htmlFor="">Sizes</label>
                        <div className="sizes">


                            {
                                ["S", "M", "L", "XL", "XXL"].map((size, index) => (
                                    <div className="size" key={index}>
                                        <p
                                            className={`${sizes.includes(size) ? "selectedSize" : ""}`}
                                            onClick={() => setSizes((prev) => prev.includes(size) ? prev.filter((item) => item != size) : [...prev, size])}>
                                            {size}
                                        </p>
                                    </div>
                                ))
                            }
                        </div>

                    </div>

                    <div className="categories ">
                        <div className="category flex-col">
                            <label htmlFor="">Category</label>
                            <select id="" name='category' onChange={handleToChange}>
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Kids">Kids</option>
                            </select>
                        </div>

                        <div className="category flex-col">
                            <label htmlFor="">SubCategory</label>
                            <select name='subCategory' onChange={handleToChange}>
                                <option value="Topwear">Topwear</option>
                                <option value="Bottomwear">Bottomwear</option>
                                <option value="Winterwear">Winterwear</option>
                            </select>
                        </div>
                    </div>

                    <div className="prices">
                        <div className="selling flex-col">
                            <label htmlFor="">Selling Price</label>
                            <input type="number" name='price' value={productData.price} placeholder='Rs' onChange={handleToChange} />
                        </div>

                        <div className="mrp flex-col">
                            <label htmlFor="">MRP Price</label>
                            <input type="number" name='mrp' value={productData.mrp} placeholder='Rs' onChange={handleToChange} />
                        </div>

                        <div className="mrp flex-col">
                            <label htmlFor="">In Stock</label>
                            <input type="number" name='inStock' value={productData.inStock} placeholder='QTY' onChange={handleToChange} />
                        </div>
                    </div>

                    <div className="bestseller">
                        <input type="checkbox" onChange={() => setBestSeller(!bestSeller)} />
                        BestSeller
                    </div>

                    <div className="btn">
                        <input type="submit" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddItems