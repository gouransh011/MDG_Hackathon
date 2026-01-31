import { useState } from 'react'
import { auth, db } from '../lib/firebaseClient'
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export default function SignUp() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', enrollment: '', bhawan: '' })
  const [msg, setMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setMsg('')
    try {
      const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password)
      await updateProfile(userCred.user, { displayName: form.name })
      // Save profile in Firestore
      await setDoc(doc(db, 'users', userCred.user.uid), {
        name: form.name,
        email: form.email,
        phone: form.phone,
        enrollment: form.enrollment,
        bhawan: form.bhawan,
        createdAt: new Date()
      })
      await sendEmailVerification(userCred.user)
      setMsg('Account created. Please check your email to verify your account.')
    } catch (err) {
      setMsg(err.message)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">Sign up</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-2 max-w-md">
        <input placeholder="Full name" className="border p-2 w-full" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input placeholder="Email" className="border p-2 w-full" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input placeholder="Password" type="password" className="border p-2 w-full" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        <input placeholder="Phone" className="border p-2 w-full" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
        <input placeholder="Enrollment no" className="border p-2 w-full" value={form.enrollment} onChange={e => setForm({...form, enrollment: e.target.value})} />
        <input placeholder="Bhawan" className="border p-2 w-full" value={form.bhawan} onChange={e => setForm({...form, bhawan: e.target.value})} />
        <button className="bg-blue-600 text-white px-4 py-2">Create account</button>
      </form>
      {msg && <p className="mt-4">{msg}</p>}
    </div>
  )
}
