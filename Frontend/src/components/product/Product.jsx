import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import "./product.css"
import { useContext } from 'react'
import { StoreContext } from '../Context'


function Product({ id, img, name, price, mrp, inStock }) {
  const { currency,products } = useContext(StoreContext)
  const discountPercentage = Math.round(((mrp - price) / mrp) * 100, 2)

  console.log("stock",inStock)

  return (<>

    <Link className='productCard' to={`/product/${id}`} key={id}>
      
      <div className="productImg">
        <img src={img[0]} alt="" />

        {
        inStock === 0 && <div className="outOfStockOverlay1">
          <div className="outOfStock1">
            <p>Out of stock</p>
          </div>
        </div>
      }
      </div>

      <p className='productName'>{name}</p>
      <div className="priceContainer">
        <p className='productPrice'>{currency}{price}</p>
        <p className='lineThroughPrice'>{currency}{mrp}</p>
        <p className='Off'>{discountPercentage}%</p>
        {/* write dis amt */}
      </div>
    </Link>
  </>

  )
}

export default Product