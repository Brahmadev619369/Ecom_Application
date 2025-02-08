import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { StoreContext } from '../Context'
import "./newCollection.css"
import Product from '../../components/product/Product'

function NewCollection() {
    const {products}  = useContext(StoreContext)
    const [latestCollection,setLatestCollection] = useState([])
    console.log(products);

    useEffect(()=>{
      setLatestCollection(products.slice(0,10))
    },[products])
    
  return (
    <div className="NewCollection">

      <div className="heading">
        <div className="line1"></div>
      <h2 className='playfair-display-font'>Latest Collection</h2>
      <div className="line1"></div>
      </div>

    {/* render the img */}
<div className="latestCollectionMainContainer">
    <div className="collectionContainer">
      {
        latestCollection.map((item,index)=>(
          <Product key={index} name = {item.name} img  = {item.image} price = {item.price} id={item._id} mrp={item.Mrp} inStock = {item.inStock}/>
        ))
      }
    </div>
    </div>
      
    </div>
  )
}

export default NewCollection