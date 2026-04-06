'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProperties() {
      const { data } = await supabase.from('properties').select('*')
      setProperties(data || [])
      setLoading(false)
    }
    fetchProperties()
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <div className="w-52 bg-slate-800 flex flex-col p-5">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">🏠</div>
          <span className="text-white font-medium">AssetSync</span>
        </div>
        <nav className="flex flex-col gap-1">
          <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm">📊 Dashboard</a>
          <a href="/properties" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white text-sm">🏠 Properties</a>
          <a href="/calendar" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white text-sm">📅 Calendar</a>
          <a href="/revenue" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white text-sm">💰 Revenue</a>
          <a href="/marketing" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white text-sm">📣 Marketing</a>
          <a href="/tasks" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white text-sm">✅ Tasks</a>
        </nav>
      </div>
      <div className="flex-1 p-6">
        <h1 className="text-white text-2xl font-medium mb-6">Good morning, Tomer 👋</h1>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="text-slate-400 text-xs mb-2">Total Properties</div>
            <div className="text-white text-2xl font-medium">{loading ? '...' : properties.length}</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="text-slate-400 text-xs mb-2">Active</div>
            <div className="text-white text-2xl font-medium">{loading ? '...' : properties.filter(p => p.status === 'active').length}</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="text-slate-400 text-xs mb-2">Monthly Revenue</div>
            <div className="text-white text-2xl font-medium">${loading ? '...' : properties.reduce((sum, p) => sum + (p.nightly_rate * 20 || 0), 0).toLocaleString()}</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="text-slate-400 text-xs mb-2">Total Rooms</div>
            <div className="text-white text-2xl font-medium">{loading ? '...' : properties.reduce((sum, p) => sum + (p.rooms || 0), 0)}</div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-medium">My Properties</h2>
            <a href="/properties" className="text-blue-400 text-sm hover:text-blue-300">View all →</a>
          </div>
          {loading ? (
            <div className="text-slate-400 text-sm">Loading...</div>
          ) : properties.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-slate-400 text-sm mb-3">No properties yet</div>
              <a href="/properties" className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600">+ Add your first property</a>
            </div>
          ) : (
            properties.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
                <div>
                  <div className="text-white text-sm font-medium">{p.name}</div>
                  <div className="text-slate-400 text-xs">{p.location}</div>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm">${p.nightly_rate}/night</div>
                  <div className="text-green-400 text-xs">{p.status}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}