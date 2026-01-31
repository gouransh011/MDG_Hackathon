import { useEffect, useState } from 'react'
import { db } from '../lib/firebaseClient'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'

export default function Admin() {
  const [issues, setIssues] = useState([])

  useEffect(() => {
    const q = query(collection(db, 'issues'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, snap => setIssues(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
  }, [])

  return (
    <div>
      <h2 className="text-xl font-semibold">Admin — Issues</h2>
      <div className="mt-4 space-y-3">
        {issues.map(i => (
          <div key={i.id} className="border p-3">
            <h3 className="font-bold">{i.title} <span className="text-sm ml-2">({i.category})</span></h3>
            <p>{i.description}</p>
            <p className="text-sm text-gray-600">Status: {i.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
