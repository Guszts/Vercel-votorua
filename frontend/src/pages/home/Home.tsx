import Hero from "./components/Hero";
import Categories from "./components/Categories";
import FeaturedMenu from "./components/FeaturedMenu";
import Banner from "./components/Banner";
import Benefits from "./components/Benefits";
import Testimonials from "./components/Testimonials";
import Info from "./components/Info";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="antialiased text-stone-900 bg-white">
      <main>
        <Hero />
        <Categories />
        <FeaturedMenu />
        <Banner />
        <Benefits />
        <Testimonials />
        <Info />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
