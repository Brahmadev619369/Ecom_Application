import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { StoreContext } from '../Context'
// import "./newCollection.css"
import Product from '../../components/product/Product'

function BestSellers() {
    const {products}  = useContext(StoreContext)
    const [bestSellers,setBestSellers] = useState([])

    const bestSellerProducts = products.filter((item)=>item.bestseller) 
    useEffect(()=>{
        setBestSellers(bestSellerProducts)
    },[products])
    
    
  return (
    <div className="NewCollection">

      <div className="heading">
        <div className="line1"></div>
      <h2 className='playfair-display-font'>BestSellers Collection</h2>
      <div className="line1"></div>
      </div>

    {/* render the img */}
<div className="latestCollectionMainContainer">
    <div className="collectionContainer">
      {
        bestSellers.map((item,index)=>(
          <Product key={index} name = {item.name} img  = {item.image} price = {item.price} id={item._id} mrp={item.Mrp} inStock = {item.inStock}/>
        ))
      }
    </div>
    </div>
      
    </div>
  )
}

export default BestSellers