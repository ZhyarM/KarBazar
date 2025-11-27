import Hero from "../page_components/Hero.tsx";
import Features from './../page_components/Features.tsx';
import TrendingServices from './../page_components/TrendingServices.tsx';
import PlatformStats from './../page_components/PlatformStats.tsx';

function Home() {
  return (
    <div className="home-background">
      <Hero />
      <Features />
      <TrendingServices />
      < PlatformStats/>
    </div>
  );
}

export default Home;
