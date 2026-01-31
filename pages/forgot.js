import { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../lib/firebaseClient'

export default function Forgot() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setMsg('')
    try {
      await sendPasswordResetEmail(auth, email)
      setMsg('Password reset email sent. Check your inbox.')
    } catch (err) {
      setMsg(err.message)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">Reset password</h2>
      <form onSubmit={handleSubmit} className="mt-4 max-w-md">
        <input placeholder="Email" className="border p-2 w-full" value={email} onChange={e => setEmail(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2 mt-2">Send reset email</button>
      </form>
      {msg && <p className="mt-4">{msg}</p>}
    </div>
  )
}
