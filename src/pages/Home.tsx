import Hero from "../page_components/Hero.tsx";
import Features from './../page_components/Features.tsx';
function Home() {
  return (
    <div className="home-background">
      <Hero />
      <Features />
    </div>
  );
}

export default Home;
