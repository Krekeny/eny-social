import Nav from "./components/Nav";
import Hero from "./components/Hero";
import RememberWhen from "./components/RememberWhen";
import WeBelieve from "./components/WeBelieve";
import ValueCards from "./components/ValueCards";
import StartingInOffenbach from "./components/StartingInOffenbach";
import Waitlist from "./components/Waitlist";
import FooterQuote from "./components/FooterQuote";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <RememberWhen />
        <WeBelieve />
        <ValueCards />
        <StartingInOffenbach />
        <Waitlist />
        <FooterQuote />
      </main>
      <Footer />
    </>
  );
}
