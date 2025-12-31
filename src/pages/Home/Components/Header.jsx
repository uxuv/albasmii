import React, { useState } from 'react'
import '../../../../src/index.css'
import logo from '../../../assets/images/Dark.svg'
import { motion, AnimatePresence } from "framer-motion"

function Header() {
  const [active, setActive] = useState('الرئيسية')
  const [menuOpen, setMenuOpen] = useState(false)

  const style = (item) =>
    `flex items-center gap-2 cursor-pointer px-4 hover:px-7 rounded-full transition-all py-3 text-lg duration-300
    ${active === item ? 'bg-[#0A1973] text-white px-5 flex items-center gap-2' : ''}`

  return (
    <>
      <img src={logo} alt="logo" className="h-12 absolute top-10" />
      <div className="fixed top-6 left-4 right-4 z-50 max-w-5xl mx-auto flex items-center justify-end">

        <div
          className="bg-[#D1D1D1]/20 backdrop-blur-xl border border-white/50 p-2 w-fit rounded-full flex items-center"
          style={{ boxShadow: "0px 12px 42px -4px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex items-center gap-1 max-[600px]:hidden">
            <h1
              onClick={() => {
                setActive('الرئيسية');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={style('الرئيسية')}
            >
              {active === 'الرئيسية' && <span className="ml-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path fill="currentColor" fillRule="evenodd" d="M15.488 4.43a.75.75 0 0 1 .081 1.058L9.988 12l5.581 6.512a.75.75 0 1 1-1.138.976l-6-7a.75.75 0 0 1 0-.976l6-7a.75.75 0 0 1 1.057-.081" clipRule="evenodd" />
                </svg>
              </span>}
              الرئيسية
            </h1>

            <a
              href="#works"
              onClick={(e) => {
                e.preventDefault(); // لمنع الانتقال الافتراضي المفاجئ
                setActive('الأعمال');
                const element = document.querySelector('#works');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={style('الأعمال')}
            >
              {active === 'الأعمال' && (
                <span className="ml-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path fill="currentColor" fillRule="evenodd" d="M15.488 4.43a.75.75 0 0 1 .081 1.058L9.988 12l5.581 6.512a.75.75 0 1 1-1.138.976l-6-7a.75.75 0 0 1 0-.976l6-7a.75.75 0 0 1 1.057-.081" clipRule="evenodd" />
                  </svg>
                </span>
              )}
              الأعمال
            </a>

          </div>

          <div className='min-[600px]:hidden rounded-full p-2'>
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className='cursor-pointer py-3 rounded-full transition-all duration-300 bg-white px-6'
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className='text-2xl'>
                <path fill="currentColor" fillRule="evenodd"
                  d="M3.25 7A.75.75 0 0 1 4 6.25h16a.75.75 0 0 1 0 1.5H4A.75.75 0 0 1 3.25 7m0 5a.75.75 0 0 1 .75-.75h11a.75.75 0 0 1 0 1.5H4a.75.75 0 0 1-.75-.75m0 5a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5H4a.75.75 0 0 1-.75-.75"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 min-[600px]:hidden"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 min-[600px]:hidden"
            >
              <div className="p-6">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="absolute top-6 left-6 text-gray-600 hover:text-gray-900"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>

                <div className="mt-16 flex flex-col gap-3">
                  <h1
                    onClick={() => {
                      setActive('الرئيسية')
                      setMenuOpen(false)
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`cursor-pointer px-6 py-3 rounded-full text-lg transition-all duration-300 text-right flex items-center justify-end
                      ${active === 'الرئيسية' ? 'bg-[#0A1973] text-white' : 'hover:bg-gray-100'}`}
                  >
                    {active === 'الرئيسية' && <span className="ml-1">&lt;</span>}
                    الرئيسية
                  </h1>
                  <a href='#works'
                    onClick={(e) => {
                      setMenuOpen(false)
                      e.preventDefault();
                      setActive('الأعمال');
                      const element = document.querySelector('#works');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}

                    className={`cursor-pointer px-6 py-3 rounded-full text-lg transition-all duration-300 text-right flex items-center justify-end
                      ${active === 'الأعمال' ? 'bg-[#0A1973] text-white' : 'hover:bg-gray-100'}`}
                  >
                    {active === 'الأعمال' && <span className="ml-1">&lt;</span>}
                    الأعمال
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header