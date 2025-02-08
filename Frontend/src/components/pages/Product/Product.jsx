import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useContext } from 'react';
import { StoreContext } from '../../Context';
import "./productDetails.css"
import { assets } from '../../../assets/assets';
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import Review from '../../review/Review';
import RelatedProducts from '../../relatedProducts/RelatedProducts';
// import { toast } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';
import { FaHeart } from "react-icons/fa";

function Product() {
  const { productId } = useParams()
  const { products, currency, addToCart, cartItems, addToWishlist, getWishlist, removeToWishlist } = useContext(StoreContext)
  const [productData, setProductData] = useState(false)
  const [image, setImage] = useState("")
  const [size, setSize] = useState("")
  const [showDescription, setShowDecription] = useState(false)
  const [wishlist, setWishlist] = useState([])
  const [iswishlisted, setIswishlisted] = useState(false)
  const token = localStorage.getItem("AuthToken")

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
      }
    })
  }


  useEffect(() => {
    fetchProductData()
  }, [productId])



  const discountPercentage = (mrp, price) => {
    return Math.round(((mrp - price) / mrp) * 100, 2)
  }

  const disableAddToCartBtn = (inStock) => inStock <= 0;



  // wishlist logic
  useEffect(() => {
    if (token) {
      getWishlist(token).then((data) => {
        if (data?.products) {
          const wishlistproducts = data.products.map((p) => p._id) || [];
          setWishlist(wishlistproducts);
          setIswishlisted(wishlistproducts.includes(productId));
        }
      })
    }
  }, [token, productId])

  console.log(iswishlisted);
  

  const handleToAddAndRemoveWishlist = async () => {
    if (!token) {
      toast.error("Login to add wishlist!");
      return;
    }

    if (iswishlisted) {
      await removeToWishlist(productId, token);
      setWishlist((prev) => prev.filter((id) => id !== productId));
      setIswishlisted(false);
    } else {
      await addToWishlist(productId, token);
      setWishlist((prev) => [...prev, productId]);
      setIswishlisted(true);
    }
  };


  return (
    <div className="ProductDetailsMainContainer">
      <Toaster />
      <div className="ProductDetailsContainer">
        <div className='productImgs'>
          <div className="allImages">
            {productData &&
              productData?.image?.map((item, index) => (
                <img
                  key={index}
                  src={item}
                  alt={`Product ${index + 1}`}
                  onClick={() => setImage(item)}
                />
              ))}
          </div>

          <div className="mainImage">
            <img src={image} />
            {
              productData?.inStock === 0 && <div className="outOfStockOverlay">
                <div className="outOfStock">
                  <p>Out of stock</p>
                </div>
              </div>
            }

<button className="wishlistBtn" onClick={() => handleToAddAndRemoveWishlist()}> <FaHeart className={`heart ${iswishlisted ? "redHeart" : ""}`} /></button>
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
            <p className='off'>{discountPercentage(productData.Mrp, productData.price)}% off</p>
          </div>

          <div className="rating">
            <img src={assets.star_icon} alt="" />
            <img src={assets.star_icon} alt="" />
            <img src={assets.star_icon} alt="" />
            <img src={assets.star_icon} alt="" />
            <img src={assets.star_dull_icon} alt="" />
            <p>{`(155)`}</p>
          </div>

          <div className="sizeContainer">
            <p>Size- UK/India</p>
            {
              productData &&
              productData.sizes.map((item, index) => {
                return (
                  <div onClick={() => setSize(item)} className={`size ${size === item ? "selectedSize" : ""}`} key={index}>{item}</div>
                )

              })
            }
          </div>
          <div className="addToCartBtn">
            <button onClick={() => addToCart(productId, size)} disabled={disableAddToCartBtn(productData.inStock)} className='cartBtn'>ADD TO CART</button>
          </div>

          {
            productData?.inStock >= 1 && productData?.inStock <= 5 && (
              <div className="herryupmsg">
                <p>{`Hurry up, only ${productData?.inStock} left!`}</p>
              </div>
            )
          }

          <hr />

          <div className="someDetails">
            <p>100% Original Product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>

          <hr />

          <div className="detailsDescription">
            <div className="btn" onClick={() => setShowDecription(!showDescription)}>
              <p>Description</p>
              {
                showDescription ?
                  <FaMinus className='plusMinus' /> :
                  <FaPlus className='plusMinus' />
              }
            </div>


            <div className={`descriptionContain ${showDescription ? "open" : ""
              }`}>
              <p>Welcome to our e-commerce platform, your ultimate destination for seamless online shopping! Our website offers a wide range of products across multiple categories, including fashion, electronics, home essentials, beauty, and more. Designed for convenience, we provide a user-friendly interface, secure payment gateways, and fast delivery options to ensure a delightful shopping experience.

                With detailed product descriptions, high-quality images, and customer reviews, you can make informed purchasing decisions. Enjoy exclusive deals, seasonal discounts, and personalized recommendations tailored just for you. Whether you're looking for the latest trends or everyday necessities, we've got you covered!

                Start shopping today and discover the joy of effortless online shopping!</p>
            </div>

          </div>

          <hr />


          <div className="reviewContainer">
            <div className="btn">
              <p>Review & Rating</p>
            </div>

            <Review productId={productId} />
          </div>



        </div>
      </div>

      {/* related product */}

      <div className="displayRelatedProducts">
        <div className="heading">
          <div className="line1"></div>
          <h2 className='playfair-display-font'>Related Collection</h2>
          <div className="line1"></div>
        </div>

        <div className="relatedProductScroll">
          <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
        </div>

      </div>

    </div>
  )
}

export default Product