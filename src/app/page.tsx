import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import HowItWorks from "@/components/site/HowItWorks";
import PopularDeals from "@/components/site/PopularDeals";
import WhyChooseUs from "@/components/site/WhyChooseUs";
import AppShowcase from "@/components/site/AppShowcase";
import Testimonials from "@/components/site/Testimonials";
import Footer from "@/components/site/Footer";
import AiAssistant from "@/components/site/AiAssistant";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden max-w-full">
        <Hero />
        <div className="pt-16 lg:pt-32">
          <HowItWorks />
        </div>
        <PopularDeals />
        <WhyChooseUs />
        <AppShowcase />
        <Testimonials />
      </main>
      <Footer />
      <AiAssistant />
    </>
  );
}
