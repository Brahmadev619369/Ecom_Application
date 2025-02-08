import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../Context'
import Product from '../../components/product/Product'
import "./relatedProducts.css"
import _ from "lodash"

function RelatedProducts({category,subCategory}) {
    const {products} = useContext(StoreContext)
    const [relatedProducts, setRelatedProducts] = useState([])

    useEffect(()=>{
        if(products.length > 0){
            // slice some of products
            let productCopy = products
    
            productCopy = productCopy.filter((item)=>category === item.category)
            productCopy = productCopy.filter((item)=>subCategory === item.subCategory)
    
            setRelatedProducts(productCopy)
        }
    },[category,subCategory])

    console.log("relatedProducts",relatedProducts);
    
    const randomRelatedProducts = _.sampleSize(relatedProducts,10)


  return (
    <div className="collectionDisplay1">
    <div className="latestCollectionMainContainer1">
      <div className="collectionContainer1">
        {
          randomRelatedProducts.map((item, index) => (
            <Product key={index} name={item.name} img={item.image} price={item.price} id={item._id} mrp={item.Mrp} inStock = {item.inStock}/>
          ))
        }
      </div>
    </div>
  </div>
  )
}

export default RelatedProducts