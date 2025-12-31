import '../../index.css'
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { motion } from 'framer-motion'

import Header from '../Dashboard/Components/Header'
import AddPhoto from '../Dashboard/Components/AddPhoto'
import AddCustomer from '../Dashboard/Components/Works'
import Customers from '../Dashboard/Components/Customers'

function Dashboard() {
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
      <div className='max-w-5xl mx-auto px-4 min-[700px]:px-0'>
        <Header />
        <AddPhoto />
        <AddCustomer />
        <Customers />

      </div>
    </>
  )
}

export default Dashboard
