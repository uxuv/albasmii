import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

import Header from './Components/Header'
import HeroSection from './Components/HeroSection'
import Works from './Components/works'

function Main() {

  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <>
      <div className='max-w-5xl mx-auto min-[700px]:px-0 px-4'>
        <Header />
        <HeroSection />
        <Works />
      </div>
    </>
  );
}

export default Main;
