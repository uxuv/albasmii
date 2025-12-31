import React from 'react'
import '../../../../src/index.css'
import CountUp from './imports/CountUp'
import { motion } from 'framer-motion'
import SplitText from "./imports/BlurText";
import { useState, useEffect } from 'react'
import supabase from '../../../../supabase'

function HeroSection() {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    supabase.storage.from("image")
      .list("", { limit: 1, sortBy: { column: "created_at", order: "desc" } })
      .then(({ data }) => {
        if (data?.length) {
          const { data: urlData } = supabase.storage.from("image").getPublicUrl(data[0].name);
          setPreview(`${urlData.publicUrl}?t=${Date.now()}`);
        }
      });
  }, []);


  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7 }}
        className="relative mt-40 flex flex-row-reverse justify-between max-[850px]:flex-col">

        <div className='relative overflow-hidden'>
        <img src={preview} className="min-[850px]:w-fit min-[850px]:h-[500px] w-full h-full object-cover" />

          <motion.div
            initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7 }}
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-60 flex-col w-fit h-fit bg-[#D1D1D1]/20 backdrop-blur-xl border border-white/50 rounded-2xl justify-center flex'>
            <div className='flex pr-5 pl-8 py-2'>
              <div className='bg-white rounded-xl size-10'></div>
              <div className='flex flex-col pr-4'>
                <p className='font-medium text-white text-[12px]'>عنوان النص</p>
                <p className='text-[12px] text-white/70 leading-4 w-32'>
                  كاوية الشعر الاحترافية محمد علي الالمانية
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className='flex flex-col'>
          <div className='mt-7 flex flex-col '>

            <div className='w-full'>
              <SplitText
                text={
                  <>
                    هنا <span className='text-[#0A1973]'>تُـــــــصاغ</span> المفاهيم
                  </>
                }
                className="md:text-6xl min-[375px]:text-[42px] min-[450px]:text-5xl max-[375px]:text-[40px] py-1 font-black"
                delay={100}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="right"
              />
            </div>

            <div className='w-full'>
              <SplitText
                text='قبل أن تُرسم الصور'
                className="md:text-6xl min-[375px]:text-[42px] min-[450px]:text-5xl max-[375px]:text-[40px]  py-1 font-black max-[450px]:-mt-3"
                delay={100}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="right"
              />
            </div>
            <p className='mt-6 sm:w-[500px] text-lg text-[#706b84]'>أهلاً بك في معرض أعمالي حيث كل مشروع هو دراسة حالة مستقلة بصفتي أحمد الباسمي لا أقدم لك تصاميم جاهزة بل أستعرض معك هنا كيف أفكك تعقيدات علامتك التجارية لأعيد صياغتها في قوالب بصرية ملهمة هنا ترى كيف تمتزج خبرة السنين بجرأة الابتكار لتخلق هوية تليق بطموحك</p>
            <div className='mt-8 flex items-center gap-4 w-full'>

              <a href="https://wa.me/+9647750401840" className='w-full'><button className=' hover:scale-[1.04] cursor-pointer bg-[#2CD46B] text-white w-full py-4 rounded-full duration-300 hover:px-12 active:scale-[0.97]'> واتساب </button></a>
              <a href="https://www.behance.net/i3w9" className='w-full'><button className=' hover:scale-[1.04] cursor-pointer bg-[#000B1D] text-white border w-full border-gray-300 py-4 rounded-full duration-300 hover:px-12 active:scale-[0.97]'>بيهانس</button></a>
            </div>
          </div>

        </div>
        
      </motion.div>










      <motion.div
        initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7 }}
        className='flex max-[850px]:justify-between justify-center gap-30 max-[550px]:gap-5 mt-25'>

        <div className='max-[450px]:flex max-[450px]:items-start max-[450px]:justify-start max-[450px]:flex-col max-[450px]:gap-3'>
          <h1 className='font-kurd text-3xl text-right'>
            <CountUp
              from={0}
              to={10}
              separator=","
              direction="up"
              duration={5}
              className="count-up-text font-kurd text-3xl max-[400px]:text-3xl"
            />
            +
          </h1>
          <h1 className='font-medium text-2xl max-[400px]:text-xl max-[400px]:-mt-3 -mt-1 max-[400px]:flex text-right max-[400px]:flex-col'>سنوات <span>الخبرة</span></h1>
        </div>

        <div className='max-[450px]:flex max-[450px]:items-start max-[450px]:justify-start max-[450px]:flex-col max-[450px]:gap-3'>
          <h1 className='font-kurd text-3xl text-right'>
            <CountUp
              from={0}
              to={2500}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text font-kurd text-3xl max-[400px]:text-3xl"
            />
            +
          </h1>
          <h1 className='font-medium text-2xl max-[400px]:text-xl max-[400px]:-mt-3 -mt-1 text-right'>تصميم</h1>
        </div>

        <div className='max-[450px]:flex max-[450px]:items-start max-[450px]:justify-start max-[450px]:flex-col max-[450px]:gap-3'>
          <h1 className='font-kurd text-3xl text-right max-[400px]:text-2xl'>
            <CountUp
              from={0}
              to={500}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text font-kurd text-3xl max-[400px]:text-3xl"
            />
            +
          </h1>
          <h1 className='font-medium text-2xl max-[400px]:text-xl max-[400px]:-mt-3 -mt-1 text-right'>عميل</h1>
        </div>
      </motion.div>
      {/* <motion.div
        initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7 }}
        className='absolute flex-col top-60 max-w-5xl left-0 right-50 mx-auto w-fit h-fit bg-[#D1D1D1]/20 backdrop-blur-xl border border-white/50 rounded-2xl justify-center flex'>
          <div className='flex pr-5 pl-18 py-4 '>
            <div className='bg-white rounded-xl size-12'></div>
            <div className='flex flex-col pr-4'>
              <p className='font-medium'>عنوان النص</p>
              <p>نص فرعي</p>
            </div>
          </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7 }}
        className='absolute flex-col top-110 max-w-5xl left-0 right-250 mx-auto w-fit h-fit bg-[#D1D1D1]/20 backdrop-blur-xl border border-white/50 rounded-2xl justify-center flex'>
          <div className='flex pr-5 pl-18 py-4 '>
            <div className='bg-white rounded-xl size-12'></div>
            <div className='flex flex-col pr-4'>
              <p className='font-medium'>عنوان النص</p>
              <p>نص فرعي</p>
            </div>
          </div>
      </motion.div> */}

    </>
  )
}

export default HeroSection
