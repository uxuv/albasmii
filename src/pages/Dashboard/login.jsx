import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../../supabase'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData.session) navigate('/Dashboard')
      else setLoading(false)
    }

    checkSession()

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) navigate('/Dashboard')
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogin = async () => {
    if (!email || !password) return alert("املأ كل الحقول")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return alert(error.message)
    navigate('/Dashboard')
  }

  if (loading) return null

  return (
    <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className='flex flex-col items-center justify-center h-screen w-screen'>
        <h1 className='font-medium text-4xl mb-15'>تسجيل الدخول</h1>
        <div className='w-96 px-10 flex flex-col gap-4'>
          <input 
            placeholder='البريد الألكتروني'
            type="text"
            className="border-none outline-none w-full bg-[#D1D1D1]/20 pr-6 py-4 border border-white/50 hover:bg-[#D1D1D1]/30 transition-all"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input 
            placeholder='كلمة المرور'
            type="password"
            className="border-none outline-none w-full bg-[#D1D1D1]/20 py-4 pr-6 border border-white/50 hover:bg-[#D1D1D1]/30 transition-all"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button 
            onClick={handleLogin}
            className='bg-[#0A1973] w-full text-white py-4 rounded-2xl mt-8 cursor-pointer'
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
