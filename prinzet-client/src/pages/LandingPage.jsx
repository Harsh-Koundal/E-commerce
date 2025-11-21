import HeroSection from '../components/Landing-page/HeroSection'
import Header from '../components/Landing-page/Header'
import React from 'react'
import PrintingCategories from '../components/Landing-page/PrintingCategories'
import Footer from '../components/Landing-page/Footer'
import FeaturedProducts from '../components/Landing-page/FeaturedProducts'
import DailyEssential from '../components/Landing-page/DailyEssential'
import Info from '../components/Landing-page/Info'

const LandingPage = () => {
  return (
    <div className='bg-gray-300 overflow-x-hidden'>
      {/* <Header/> */}
      <HeroSection/>
      <PrintingCategories/>
      <FeaturedProducts/>
      <DailyEssential/>
      <Info/>
      {/* <Footer/> */}
    </div>
  )
}

export default LandingPage
