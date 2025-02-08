import React from 'react'
import Banner from "../../Banner/Banner"
import NewCollection from '../../NewCollection/NewCollection'
import BestSellers from '../../bestSellers/BestSellers'
import "./home.css"
import ContactSupport from '../../contactSupport/ContactSupport'
import Subscribe from '../../subscribe/Subscribe'

function Home() {
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