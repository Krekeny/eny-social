import Nav from "./components/Nav";
import Hero from "./components/Hero";
import RememberWhen from "./components/RememberWhen";
import WeBelieve from "./components/WeBelieve";
import ValueCards from "./components/ValueCards";
import StartingInOffenbach from "./components/StartingInOffenbach";
import Waitlist from "./components/Waitlist";
import FooterQuote from "./components/FooterQuote";
import Footer from "./components/Footer";
import GrainedBlob from "./components/GrainedBlob";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Nav />
      <main className="relative z-10">
        <Hero />
        <RememberWhen />
        <WeBelieve />
        <ValueCards />
        <StartingInOffenbach />
        <Waitlist />
      </main>
      <div className="relative z-0 overflow-clip pt-[500px] -mt-[500px]">
        <GrainedBlob className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/8 rotate-55 z-0 w-[150%] h-auto" />
        <div className="relative z-10">
          <FooterQuote />
          <Footer />
        </div>
      </div>
    </div>
  );
}
