import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-2xl">🏠</span>
        </div>
        <h1 className="text-4xl font-medium text-white mb-3">AssetSync</h1>
        <p className="text-slate-400 mb-8">Smart property management in one place</p>
        <Link href="/dashboard" className="bg-blue-500 text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-blue-600 transition">
          Get Started
        </Link>
      </div>
    </main>
  )
}
