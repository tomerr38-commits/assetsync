'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Properties() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', location: '', type: '', rooms: '', nightly_rate: '' })

  useEffect(() => {
    fetchProperties()
  }, [])

  async function fetchProperties() {
    const { data } = await supabase.from('properties').select('*')
    setProperties(data || [])
    setLoading(false)
  }

  async function addProperty() {
    if (!form.name) return
    await supabase.from('properties').insert([{
      name: form.name,
      location: form.location,
      type: form.type,
      rooms: parseInt(form.rooms) || 1,
      nightly_rate: parseFloat(form.nightly_rate) || 0,
      status: 'active'
    }])
    setForm({ name: '', location: '', type: '', rooms: '', nightly_rate: '' })
    setShowForm(false)
    fetchProperties()
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <div className="w-52 bg-slate-800 flex flex-col p-5">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">🏠</div>
          <span className="text-white font-medium">AssetSync</span>
        </div>
        <nav className="flex flex-col gap-1">
          <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white text-sm">📊 Dashboard</a>
          <a href="/properties" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm">🏠 Properties</a>
          <a href="/calendar" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white text-sm">📅 Calendar</a>
          <a href="/revenue" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white text-sm">💰 Revenue</a>
          <a href="/marketing" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white text-sm">📣 Marketing</a>
          <a href="/tasks" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white text-sm">✅ Tasks</a>
        </nav>
      </div>
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-2xl font-medium">Properties</h1>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600">
            + Add Property
          </button>
        </div>
        {showForm && (
          <div className="bg-slate-800 rounded-xl p-5 mb-6">
            <h2 className="text-white font-medium mb-4">New Property</h2>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Property name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm outline-none" />
              <input placeholder="Location (city)" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm outline-none" />
              <input placeholder="Type (apartment/villa...)" value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm outline-none" />
              <input placeholder="Number of rooms" value={form.rooms} onChange={e => setForm({...form, rooms: e.target.value})} className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm outline-none" type="number" />
              <input placeholder="Nightly rate ($)" value={form.nightly_rate} onChange={e => setForm({...form, nightly_rate: e.target.value})} className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm outline-none" type="number" />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={addProperty} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600">Save Property</button>
              <button onClick={() => setShowForm(false)} className="text-slate-400 px-4 py-2 rounded-lg text-sm hover:text-white">Cancel</button>
            </div>
          </div>
        )}
        {loading ? (
          <div className="text-slate-400">Loading...</div>
        ) : properties.length === 0 ? (
          <div className="bg-slate-800 rounded-xl p-10 text-center">
            <div className="text-4xl mb-3">🏠</div>
            <div className="text-white font-medium mb-2">No properties yet</div>
            <div className="text-slate-400 text-sm">Click "+ Add Property" to get started</div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {properties.map((p) => (
              <div key={p.id} className="bg-slate-800 rounded-xl p-5">
                <div className="text-2xl mb-3">🏠</div>
                <div className="text-white font-medium mb-1">{p.name}</div>
                <div className="text-slate-400 text-xs mb-3">📍 {p.location}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-700 rounded-lg p-2">
                    <div className="text-slate-400 text-xs">Nightly</div>
                    <div className="text-white text-sm">${p.nightly_rate}</div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-2">
                    <div className="text-slate-400 text-xs">Rooms</div>
                    <div className="text-white text-sm">{p.rooms}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}