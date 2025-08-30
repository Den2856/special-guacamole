import Header from "../components/Header"
import CustomerReviews from "../components/home/CustomerReviews"
import Footer from "../components/home/Footer"
import Hero from "../components/home/Hero"
import TopSelling from "../components/home/TopSelling"
import TrendyPlants from "../components/home/TrendyPlants"

export default function Home() {


  return (
    <>
      <Header />
      <Hero />
      <TrendyPlants />
      <TopSelling />
      <CustomerReviews />
      <Footer />
    </>

  )
}
