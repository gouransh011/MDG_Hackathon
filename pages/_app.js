import '../styles/globals.css'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { auth } from '../lib/firebaseClient'
import { onAuthStateChanged, signOut } from 'firebase/auth'

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u))
  }, [])

  return (
    <div>
      <header className="p-4 border-b">
        <div className="container mx-auto flex justify-between">
          <h1 className="font-bold">Campus Issues</h1>
          <nav>
            <Link href="/">Home</Link> {' | '}
            <Link href="/report">Report</Link> {' | '}
            <Link href="/admin">Admin</Link> {' | '}
            {user ? (
              <button onClick={() => signOut(auth)} className="ml-2">Sign out</button>
            ) : (
              <>
                <Link href="/signin">Sign in</Link> {' / '}
                <Link href="/signup">Sign up</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <Component {...pageProps} />
      </main>
    </div>
  )
}
