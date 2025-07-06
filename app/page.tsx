'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Onchain Rating</h1>
      <p style={{ marginBottom: 20 }}>Submit content, get it rated by verified users.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Link href="/submit">
          <button style={{ padding: 10, backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: 5 }}>
            Submit Content
          </button>
        </Link>

        <Link href="/rate">
          <button style={{ padding: 10, backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: 5 }}>
            Rate Submissions
          </button>
        </Link>
        
      </div>
    </main>
  )
}
