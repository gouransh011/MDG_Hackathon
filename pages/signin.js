import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../lib/firebaseClient'
import { useRouter } from 'next/router'

export default function SignIn() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [msg, setMsg] = useState('')
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setMsg('')
    try {
      const credential = await signInWithEmailAndPassword(auth, form.email, form.password)
      if (!credential.user.emailVerified) {
        setMsg('Please verify your email before signing in.')
        return
      }
      router.push('/')
    } catch (err) {
      setMsg(err.message)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">Sign in</h2>
      <form onSubmit={handleSubmit} className="mt-4 max-w-md space-y-2">
        <input placeholder="Email" className="border p-2 w-full" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input placeholder="Password" type="password" className="border p-2 w-full" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        <button className="bg-blue-600 text-white px-4 py-2">Sign in</button>
      </form>
      <p className="mt-2"><a href="/forgot" className="text-sm">Forgot password?</a></p>
      {msg && <p className="mt-4">{msg}</p>}
    </div>
  )
}
