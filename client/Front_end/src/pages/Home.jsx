import React from 'react'

import ServiceCategories from '../components/HomePageComponents/ServicesCategories'
import HowItWorks from '../components/HomePageComponents/HowItWorks'
import WhyChooseUs from '../components/HomePageComponents/WhyChooseUs'
import Footer from '../components/HomePageComponents/Footer'
import Navbar from '../components/HomePageComponents/Navbar'
import Heros from '../components/HomePageComponents/Heros'

function Home() {
  return (
    <>  
      <Navbar/>
      <Heros/>
      <ServiceCategories/>
      <HowItWorks/>
      <WhyChooseUs/>
      <Footer/> 
    </>
  )
}

export default Home
