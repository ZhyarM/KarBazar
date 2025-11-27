import Hero from "../page_components/Hero.tsx";
import Features from './../page_components/Features.tsx';
import TrendingServices from './../page_components/TrendingServices.tsx';
import PlatformStats from './../page_components/PlatformStats.tsx';
import CallToActionSection from './../page_components/CallToActionSection.tsx';

function Home() {
  return (
    <div className="home-background">
      <Hero />
      <Features />
      <TrendingServices />
      < PlatformStats/>
      <CallToActionSection />
    </div>
  );
}

export default Home;
