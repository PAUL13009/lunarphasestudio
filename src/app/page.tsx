import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Intro from "@/components/Intro";
import Portfolio from "@/components/Portfolio";
import AllWork from "@/components/AllWork";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative z-10 bg-black">
        <HeroSection />
        <Intro />
        <Portfolio />
        <AllWork />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
