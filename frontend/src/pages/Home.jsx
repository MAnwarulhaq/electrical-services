import Hero from "../components/Hero";
import ServicesPreview from "../components/ServicesPreview";
import WhyChooseUs from "../components/WhyChooseUs";
import HowItWorks from "../components/HowItWorks";
import StatsSection from "../components/StatsSection";
import Testimonials from "../components/Testimonials";
import EmergencyCTA from "../components/EmergencyCTA";

const Home = () => {
  return (
    <>
      <Hero />
      <ServicesPreview />
      <WhyChooseUs />
      <HowItWorks />
      <StatsSection />
      <Testimonials />
      <EmergencyCTA />
    </>
  );
};

export default Home;