import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { storeContext } from '../../context/context';
import { FaPlus, FaMinus } from "react-icons/fa6";
import axios from 'axios';
import "./itemDetails.css"
import { Navigate } from 'react-router-dom'

function ItemDetails() {
    const { productId } = useParams();
    const { currency,auth } = useContext(storeContext);
    const [productData, setProductData] = useState({});
    const [image, setImage] = useState("");
    const [size, setSize] = useState("");
    const [showDescription, setShowDecription] = useState(false);

    if (auth?.role === "Worker") {
          return <Navigate to="/login" />
      }
    const fetchProductData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/products/${productId}`);
            setProductData(res.data);
            setImage(res.data.image[0]);
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    useEffect(() => {
        fetchProductData();
    }, [productId]);

    const dis = (mrp, price) => {
        if (!mrp || !price) return 0; 
        const discount = ((mrp - price) / mrp) * 100;
        return Math.round(discount * 100) / 100; 
    };
    

    return (
        <div className="ProductDetailsMainContainer">
            <div className="ProductDetailsContainer">
                <div className='productImgs'>
                    <div className="allImages">
                        {productData?.image?.map((item, index) => (
                            <img key={index} src={item} alt={`Product ${index + 1}`} onClick={() => setImage(item)} />
                        ))}
                    </div>

                    <div className="mainImage">
                        <img src={image} alt="Selected Product" />
                    </div>
                </div>

                <div className="productDetails">
                    <div className="title">
                        <p>{productData.name}</p>
                    </div>

                    <div className="description">
                        <p>{productData.description}</p>
                    </div>

                    <div className="price">
                        <p className='sellingPrice'>{currency}{productData.price}</p>
                        <p className='MRP'>{currency}{productData.Mrp}</p>
                        <p className='off'>{dis(productData.Mrp,productData.price)}% off</p>
                    </div>

                    <div className="sizeContainer">
                        <p>Size- UK/India</p>
                        {productData?.sizes?.map((item, index) => (
                            <div key={index} 
                                 onClick={() => setSize(item)} 
                                 className={`size ${size === item ? "selectedSize" : ""}`}>
                                {item}
                            </div>
                        ))}
                    </div>

                    <hr />

                    <div className="detailsDescription">
                        <div className="btn" onClick={() => setShowDecription(!showDescription)}>
                            <p>Description</p>
                            {showDescription ? <FaMinus className='plusMinus' /> : <FaPlus className='plusMinus' />}
                        </div>

                        <div className={`descriptionContain ${
                showDescription ? "open" : ""
              }`}>
                <p>Welcome to our e-commerce platform, your ultimate destination for seamless online shopping! Our website offers a wide range of products across multiple categories, including fashion, electronics, home essentials, beauty, and more. Designed for convenience, we provide a user-friendly interface, secure payment gateways, and fast delivery options to ensure a delightful shopping experience.

                  With detailed product descriptions, high-quality images, and customer reviews, you can make informed purchasing decisions. Enjoy exclusive deals, seasonal discounts, and personalized recommendations tailored just for you. Whether you're looking for the latest trends or everyday necessities, we've got you covered!

                  Start shopping today and discover the joy of effortless online shopping!</p>
              </div>
                    </div>

                    <hr />
                </div>
            </div>
        </div>
    );
}

export default ItemDetails;
