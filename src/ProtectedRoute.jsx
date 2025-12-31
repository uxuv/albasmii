import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import supabase from '../supabase'

export default function ProtectedRoute({ children }) {
  const [authenticated, setAuthenticated] = useState(null) // null = loading

  useEffect(() => {
    const checkUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        setAuthenticated(false)
        return
      }
      const { data: userData, error } = await supabase.auth.getUser()
      if (error || !userData.user) {
        await supabase.auth.signOut()
        setAuthenticated(false)
      } else {
        setAuthenticated(true)
      }
    }

    checkUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) setAuthenticated(false)
      else setAuthenticated(true)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (authenticated === null) return null // لا تعرض شيء أثناء التحقق
  return authenticated ? children : <Navigate to="/Login" replace />
}
