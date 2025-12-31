import React from 'react'
import '../../../../src/index.css'
import CountUp from './imports/CountUp'
import { motion } from "framer-motion";

function HeroSection() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7 }}

        className='relative mt-40 flex flex-col items-center'>
        <div className="absolute left-1/2 -translate-x-1/2 -z-10 max-w-4xl w-full">
          <div className='grid grid-flow-col auto-cols-fr w-full justify-between gap-5'>
            <div className=' max-[400px]:hidden h-100 w-full rounded-xl bg-[#E5E2E5]'></div>
            <div className='max-[700px]:hidden h-100 w-full rounded-xl bg-[#E5E2E5]'></div>
            <div className='max-[900px]:hidden h-100 w-full rounded-xl bg-[#E5E2E5]'></div>
            <div className='max-[900px]:hidden h-100 w-full rounded-xl bg-[#E5E2E5]'></div>
            <div className=' max-[400px]:hidden h-100 w-full rounded-xl bg-[#E5E2E5]'></div>
          </div>
        </div>

        <div className='mt-2 px-16 py-2.5 w-fit rounded-full border flex items-center justify-center gap-4 border-solid border-gray-600 '>
          <h1><span className='font-kurd'>500+ </span>عميل جديد</h1>
        </div>

        <div className='mt-7 flex flex-col items-center justify-center'>
          <h1 className='text-6xl font-semibold text-center'>الفلوس عليك <br /> والتصميم علينا</h1>
          <p className='text-center mt-6 sm:w-lg'>في عالم تصميم المواقع والطباعة، دائماً ما نبحث عن وسيلة لملء الفراغات بنصوص جميلة، ولكن تفتقر هذه النصوص إلى المعنى الحقيقي لها. حيث يأتي "مولد النص العربي لوريم إيبسوم" لحل المشكلة بسرعة، </p>
          <a href=""><button className='mt-8 cursor-pointer bg-black text-white px-12 py-4 rounded-full duration-300 hover:px-14 active:scale-[0.97]'>تصفح الأعمال</button></a>
        </div>

      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7 }}

        className='flex items-center justify-center gap-30 max-[550px]:gap-15 max-[450px]:flex-col mt-25'>
        <div className=' max-[450px]:flex max-[450px]:items-center max-[450px]:justify-center max-[450px]:flex-col max-[450px]:gap-3 '>
          <h1 className='font-kurd text-3xl'>
            <CountUp
              from={0}
              to={12}
              separator=","
              direction="up"
              duration={5}
              className="count-up-text font-kurd text-3xl"

            />
            +
          </h1>
          <h1 className='font-medium text-2xl -mt-1'>سنوات الخبرة</h1>
        </div>
        <div className='max-[450px]:flex max-[450px]:items-center max-[450px]:justify-center max-[450px]:flex-col max-[450px]:gap-3'>
          <h1 className='font-kurd text-3xl'>
            <CountUp
              from={0}
              to={2500}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text font-kurd text-3xl"
            />
            +
          </h1>
          <h1 className='font-medium text-2xl -mt-1'>تصميم</h1>
        </div>

        <div className='max-[450px]:flex max-[450px]:items-center max-[450px]:justify-center max-[450px]:flex-col max-[450px]:gap-3'>
          <h1 className='font-kurd text-3xl'>
            <CountUp
              from={0}
              to={1300}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text font-kurd text-3xl"
            />
            +
          </h1>
          <h1 className='font-medium text-2xl -mt-1'>عميل</h1>
        </div>
      </motion.div>

    </>
  )
}

export default HeroSection
