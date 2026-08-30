import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import AiAssistant from "@/components/site/AiAssistant";
import CarsClient from "@/components/site/CarsClient";

export default function CarsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 lg:pt-28">
        <CarsClient />
      </main>
      <Footer />
      <AiAssistant />
    </>
  );
}
