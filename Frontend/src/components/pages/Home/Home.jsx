import React, { useEffect } from 'react'
import Banner from "../../Banner/Banner"
import NewCollection from '../../NewCollection/NewCollection'
import BestSellers from '../../bestSellers/BestSellers'
import "./home.css"
import ContactSupport from '../../contactSupport/ContactSupport'
import Subscribe from '../../subscribe/Subscribe'

function Home() {
  useEffect(() => {
    window.scrollTo({top:0,behavior:"smooth"});
}, []);


  return (
    <>
    <Banner/>
    <NewCollection/>
    <BestSellers/>
    <ContactSupport/>
    <Subscribe/>
    </>
  )
}

export default Home