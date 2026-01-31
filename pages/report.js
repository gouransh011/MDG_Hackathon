import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
const MapPicker = dynamic(() => import('../components/MapPicker'), { ssr: false })
import { auth, db, storage } from '../lib/firebaseClient'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

export default function Report() {
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', category: 'pothole' })
  const [photo, setPhoto] = useState(null)
  const [location, setLocation] = useState(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return unsub
  }, [])

  async function handleSubmit(e) {
    e.preventDefault(); setMsg('')
    if (!user) { setMsg('You must be signed in to report an issue.'); return }
    try {
      let photoURL = ''
      if (photo) {
        const storageRef = ref(storage, `issues/${Date.now()}_${photo.name}`)
        await uploadBytes(storageRef, photo)
        photoURL = await getDownloadURL(storageRef)
      }
      await addDoc(collection(db, 'issues'), {
        title: form.title,
        description: form.description,
        category: form.category,
        photoURL,
        location: location || null,
        status: 'reported',
        reporterUid: user.uid,
        createdAt: serverTimestamp()
      })
      setMsg('Issue reported. Thank you!')
      setForm({ title: '', description: '', category: 'pothole' })
      setPhoto(null)
      setLocation(null)
    } catch (err) {
      setMsg(err.message)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">Report an issue</h2>
      <form onSubmit={handleSubmit} className="mt-4 max-w-lg space-y-3">
        <input placeholder="Title" className="border p-2 w-full" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
        <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="border p-2 w-full">
          <option value="pothole">Pothole</option>
          <option value="garbage">Garbage</option>
          <option value="streetlight">Broken streetlight</option>
          <option value="other">Other</option>
        </select>
        <textarea placeholder="Description" className="border p-2 w-full" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        <input type="file" onChange={e => setPhoto(e.target.files[0])} />
        <div>
          <p className="mb-2">Pick location:</p>
          <MapPicker onSelect={(loc)=>setLocation(loc)} />
        </div>
        <button className="bg-green-600 text-white px-4 py-2">Submit report</button>
      </form>
      {msg && <p className="mt-4">{msg}</p>}
    </div>
  )
}
