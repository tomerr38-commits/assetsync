'use client'
import { useState } from 'react'

const platforms = [
  { name: 'Airbnb', icon: '🏠', color: 'bg-red-500/20 text-red-400', connected: true },
  { name: 'Booking.com', icon: '🅱️', color: 'bg-blue-500/20 text-blue-400', connected: true },
  { name: 'Instagram', icon: '📸', color: 'bg-pink-500/20 text-pink-400', connected: true },
  { name: 'Facebook', icon: '👤', color: 'bg-blue-500/20 text-blue-400', connected: true },
  { name: 'Bank', icon: '🏦', color: 'bg-green-500/20 text-green-400', connected: false },
]

const automations = [
  { title: 'Auto-post new listings', desc: 'Publish to Instagram & Facebook automatically', enabled: true },
  { title: 'Price sync across platforms', desc: 'Keep Airbnb & Booking prices aligned', enabled: true },
  { title: 'Guest review reminders', desc: 'Send reminder 24h after checkout', enabled: false },
  { title: 'Weekly performance report', desc: 'Email digest every Monday morning', enabled: true },
  { title: 'Low occupancy alerts', desc: 'Notify when occupancy drops below 60%', enabled: true },
]

export default function Marketing() {
  const [autos, setAutos] = useState(automations)
  const [connected, setConnected] = useState(platforms.map(p => p.connected))

  function toggleAuto(i: number) {
    setAutos(prev => prev.map((a, idx) => idx === i ? { ...a, enabled: !a.enabled } : a))
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
          <a href="/properties" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white text-sm">🏠 Properties</a>
          <a href="/calendar" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white text-sm">📅 Calendar</a>
          <a href="/revenue" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white text-sm">💰 Revenue</a>
          <a href="/marketing" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm">📣 Marketing</a>
          <a href="/tasks" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white text-sm">✅ Tasks</a>
        </nav>
      </div>
      <div className="flex-1 p-6">
        <h1 className="text-white text-2xl font-medium mb-6">Marketing & Automation</h1>

        <div className="bg-slate-800 rounded-xl p-5 mb-5">
          <h2 className="text-white font-medium mb-4">Connected Platforms</h2>
          <div className="grid grid-cols-5 gap-3">
            {platforms.map((p, i) => (
              <div key={p.name} onClick={() => setConnected(prev => prev.map((c, idx) => idx === i ? !c : c))}
                className={`rounded-xl p-4 text-center cursor-pointer border transition-all ${connected[i] ? 'border-green-500/50 bg-green-500/10' : 'border-slate-700 bg-slate-700/50'}`}>
                <div className="text-2xl mb-2">{p.icon}</div>
                <div className="text-white text-xs font-medium">{p.name}</div>
                <div className={`text-xs mt-1 ${connected[i] ? 'text-green-400' : 'text-slate-400'}`}>
                  {connected[i] ? 'Connected' : '+ Connect'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="bg-slate-800 rounded-xl p-5">
            <h2 className="text-white font-medium mb-4">Automation Rules</h2>
            {autos.map((a, i) => (
              <div key={a.title} className="flex items-center gap-3 py-3 border-b border-slate-700 last:border-0">
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{a.title}</div>
                  <div className="text-slate-400 text-xs">{a.desc}</div>
                </div>
                <div onClick={() => toggleAuto(i)} className={`w-10 h-5 rounded-full cursor-pointer transition-all relative ${a.enabled ? 'bg-blue-500' : 'bg-slate-600'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${a.enabled ? 'left-5' : 'left-0.5'}`}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-800 rounded-xl p-5">
            <h2 className="text-white font-medium mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-slate-700 rounded-lg p-3">
                <div className="text-slate-400 text-xs mb-1">Active campaigns</div>
                <div className="text-white text-xl font-medium">2</div>
              </div>
              <div className="bg-slate-700 rounded-lg p-3">
                <div className="text-slate-400 text-xs mb-1">Monthly spend</div>
                <div className="text-white text-xl font-medium">$100</div>
              </div>
              <div className="bg-slate-700 rounded-lg p-3">
                <div className="text-slate-400 text-xs mb-1">Total reach</div>
                <div className="text-white text-xl font-medium">32.7k</div>
              </div>
              <div className="bg-slate-700 rounded-lg p-3">
                <div className="text-slate-400 text-xs mb-1">Conversions</div>
                <div className="text-white text-xl font-medium">14</div>
              </div>
            </div>
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg text-sm hover:bg-blue-600">
              + New Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}