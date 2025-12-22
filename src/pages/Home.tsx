import Hero from "../page_components/home_page/Hero.tsx";
import Features from "./../page_components/home_page/Features.tsx";
import TrendingServices from "../page_components/home_page/TrendingServices.tsx";
import PlatformStats from "../page_components/home_page/PlatformStats.tsx";
import CallToActionSection from "./../page_components/home_page/CallToActionSection.tsx";

function Home() {
  return (
    <div className="home-background">
      <Hero />
      <Features />
      <TrendingServices />
      <PlatformStats />
      <CallToActionSection />
    </div>
  );
}

export default Home;
