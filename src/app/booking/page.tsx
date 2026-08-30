import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import AiAssistant from "@/components/site/AiAssistant";
import BookingClient from "@/components/site/BookingClient";

export default function BookingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] pt-24 lg:pt-28">
        <div className="container-x pb-24">
          <BookingClient />
        </div>
      </main>
      <Footer />
      <AiAssistant />
    </>
  );
}
