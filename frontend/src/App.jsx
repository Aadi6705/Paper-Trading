import { useEffect, useState } from 'react'

function App() {
  const [health, setHealth] = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/health`)
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Paper Trading Platform</h1>
      <div className="p-4 bg-surface rounded-xl border border-border-subtle inline-block">
        <p className="text-sm text-secondary">Backend Status:</p>
        <pre className="mt-2 text-success font-mono">{health ? JSON.stringify(health, null, 2) : 'Loading...'}</pre>
      </div>
    </div>
  )
}

export default App
