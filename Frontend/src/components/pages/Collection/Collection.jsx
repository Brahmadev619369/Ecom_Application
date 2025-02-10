import React, { useState, useEffect } from "react";
import "./collection.css";
import { useContext } from "react";
import { StoreContext } from "../../Context";
import Product from '../../../components/product/Product'
import { RxCross2 } from "react-icons/rx";
import SearchBar from '../../searchBar/SearchBar'
import LoaderNew from "../../loader2/LoaderNew";

function Collection() {
  const { products,search,showSearchBtn,productsLoader} = useContext(StoreContext)
  const [showFilters, setShowFilters] = useState(false);
  const [product, setProduct] = useState([])
  const [filterProduct,setFilterProduct]  = useState([])
  const [category,setCategory] = useState([])
  const [subCategory,setSubCategory] = useState([])
  const [price,setPrice] = useState([])



  //temp
  useEffect(() => {
    setProduct(products)
  }, [])

  useEffect(() => {
    window.scrollTo({top:0,behavior:"smooth"});
}, []);

  // Adjust filter visibility based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setShowFilters(true);
      } else {
        setShowFilters(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  //filter product
const toggleCategory = (e) =>{
  const value = e.target.value
  setCategory((prev)=>prev.includes(value) ? 
  prev.filter((item)=>item !== value) : [...prev , value])

};

console.log(filterProduct);

const toggleSubCategory = (e) =>{
  const value = e.target.value
  setSubCategory((prev)=>prev.includes(value) ? 
  prev.filter((item)=>item !== value) : [...prev,value])
}

const togglePrice = (e) =>{
  setPrice(e.target.value)
}

console.log(search);


// Apply filters on product 
useEffect(()=>{
  let filtered = [...products]

  if(search && showSearchBtn){
    filtered = filtered.filter(item=>item.name.toLowerCase().includes(search.toLowerCase()))
  }

  if(category.length > 0){
    filtered = filtered.filter((item)=>category.includes(item.category))
  }

  if(subCategory.length > 0){
    filtered = filtered.filter((item)=>subCategory.includes(item.subCategory))}

  if(price === "LOW TO HIGH"){
    filtered.sort((a,b)=>a.price - b.price)
  }
  else if (price === "HIGH TO LOW"){
    filtered.sort((a,b)=>b.price - a.price)
  }

  setFilterProduct(filtered)
  
  
},[category, subCategory, price, products,search])


  return (
    <div className="collectionContainer">
      {
        productsLoader && <LoaderNew/>
      }
          {showSearchBtn && 
      <SearchBar/>
    }
      <div className="filterSection">
        {/* Toggle button for small screens */}
        <div className="filterToggle" onClick={() => setShowFilters((prev) => !prev)}>
          <h4>Filters</h4>
        </div>

        {/* Filters section */}

        <div className={`collectionFilter ${showFilters ? "showFilters" : ""}`}>
          <div className="titleCross">
            <h4 className="titleFilter playfair-display-font">Filters</h4>
            <RxCross2 className="crossFilter" onClick={() => setShowFilters(false)} />
          </div>
          <div className="category">
            <h4 className="playfair-display-font">CATEGORIES</h4>
            <label>
              <input type="checkbox" value="Men" onChange={toggleCategory}/>
              Men
            </label>
            <label>
              <input type="checkbox" value="Women" onChange={toggleCategory} />
              Women
            </label>
            <label>
              <input type="checkbox" value="Kids" onChange={toggleCategory}/>
              Kids
            </label>
          </div>

          <div className="category">
            <h4 className="playfair-display-font">SUB CATEGORIES</h4>
            <label>
              <input type="checkbox" value="Topwear" onChange={toggleSubCategory}/>
              Topwear
            </label>
            <label>
              <input type="checkbox" value="Bottomwear" onChange={toggleSubCategory}/>
              Bottomwear
            </label>
            <label>
              <input type="checkbox" value="Winterwear" onChange={toggleSubCategory}/>
              Winterwear
            </label>
          </div>

          <div className="category">
            <h4 className="playfair-display-font">PRICE</h4>
            <label>
              <input type="checkbox" name = "price" value="LOW TO HIGH" onChange={togglePrice}/>
              LOW TO HIGH
            </label>
            <label>
              <input type="checkbox" name = "price" value="HIGH TO LOW" onChange={togglePrice}/>
              HIGH TO LOW
            </label>
            <label>
              <input type="checkbox" name = "price" value="Relevant" onChange={togglePrice} />
              Relevant
            </label>
          </div>


        </div>
      </div>


      <div className="collectionSection">
        <div className="collectionHead">
          <div className="heading">
            <div className="line1"></div>
            <h2 className='playfair-display-font'>Collection</h2>
            <div className="line1"></div>
          </div>
        </div>

        <div className="collectionDisplay">
          <div className="latestCollectionMainContainer">
            <div className="collectionContainer">
              {
                filterProduct.map((item, index) => (
                  <Product key={index} name={item.name} img={item.image} price={item.price} id={item._id} mrp={item.Mrp} inStock = {item.inStock}/>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Collection;
