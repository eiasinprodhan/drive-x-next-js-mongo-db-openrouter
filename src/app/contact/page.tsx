import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import AiAssistant from "@/components/site/AiAssistant";
import ContactClient from "@/components/site/ContactClient";
import { Clock3, Headset, Mail, MapPin } from "lucide-react";

const INFO = [
  { icon: Headset, title: "24/7 Support", desc: "support@drivex.io\n+880 1700-000000" },
  { icon: MapPin, title: "Head office", desc: "Gulshan Avenue 12\nDhaka 1212, Bangladesh" },
  { icon: Clock3, title: "Airport counters", desc: "Open 24 hours\nAll major airports" },
  { icon: Mail, title: "Partnerships", desc: "partners@drivex.io\nB2B & fleet deals" },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 lg:pt-28">
        <section className="bg-navy-950 py-16 text-center text-white">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-400">Contact us</p>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Get in touch — we reply fast</h1>
          <p className="mt-2 text-sm text-navy-300">Or ask Rex, our AI concierge, anything — he never sleeps.</p>
        </section>

        <div className="container-x grid gap-8 py-16 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-4">
            {INFO.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card flex items-start gap-4 p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="font-extrabold text-navy-900">{title}</p>
                  <p className="mt-1 whitespace-pre-line text-sm text-navy-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <ContactClient />
        </div>
      </main>
      <Footer />
      <AiAssistant />
    </>
  );
}
