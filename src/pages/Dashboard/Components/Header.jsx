import React, { useState } from 'react'
import '../../../../src/index.css'
import logo from '../../../assets/images/Dark.svg'

function Header() {
    return (
        <>
            <img src={logo} alt="logo" className="h-12 absolute top-10" />
            <div className="fixed top-6 left-4 right-4 z-50 max-w-5xl mx-auto flex items-center justify-end">

                <div className="bg-[#D1D1D1]/20 p-1.5 backdrop-blur-xl border border-white/50 w-fit rounded-full flex items-center"
                    style={{ 'boxShadow': "0px 12px 42px -4px rgba(0, 0, 0, 0.1)" }}>

                    <div className="flex items-center gap-1 max-[600px]:hidden">
                        <a href='/' className='cursor-pointer py-3 px-4 hover:px-7 rounded-full transition-all py-4 text-lg duration-300 bg-white px-6'>الموقع الألكتروني</a>
                    </div>

                    <div className='min-[600px]:hidden rounded-full p-2'>
                        <div className='cursor-pointer py-3 rounded-full transition-all duration-300 bg-white px-6'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className='text-2xl'>
                                <path fill="currentColor" fillRule="evenodd" d="M3.25 7A.75.75 0 0 1 4 6.25h16a.75.75 0 0 1 0 1.5H4A.75.75 0 0 1 3.25 7m0 5a.75.75 0 0 1 .75-.75h11a.75.75 0 0 1 0 1.5H4a.75.75 0 0 1-.75-.75m0 5a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5H4a.75.75 0 0 1-.75-.75" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Header
