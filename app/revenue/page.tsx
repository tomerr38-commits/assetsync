'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Revenue() {
  const [bookings, setBookings] = useState<any[]>([])
  const [properties, setProperties] = useState<any[]>([])

  useEffect(() => {
    supabase.from('bookings').select('*, properties(name)').then(({ data }) => setBookings(data || []))
    supabase.from('properties').select('*').then(({ data }) => setProperties(data || []))
  }, [])

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0)
  const thisMonth = bookings.filter(b => new Date(b.check_in).getMonth() === new Date().getMonth()).reduce((sum, b) => sum + (b.amount || 0), 0)

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
          <a href="/revenue" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm">💰 Revenue</a>
          <a href="/marketing" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white text-sm">📣 Marketing</a>
          <a href="/tasks" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white text-sm">✅ Tasks</a>
        </nav>
      </div>
      <div className="flex-1 p-6">
        <h1 className="text-white text-2xl font-medium mb-6">Revenue</h1>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="text-slate-400 text-xs mb-2">Total Revenue</div>
            <div className="text-white text-2xl font-medium">${totalRevenue.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="text-slate-400 text-xs mb-2">This Month</div>
            <div className="text-white text-2xl font-medium">${thisMonth.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="text-slate-400 text-xs mb-2">Total Bookings</div>
            <div className="text-white text-2xl font-medium">{bookings.length}</div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-5 mb-6">
          <h2 className="text-white font-medium mb-4">Revenue by Property</h2>
          {properties.length === 0 ? (
            <div className="text-slate-400 text-sm">No properties yet</div>
          ) : (
            properties.map(p => {
              const propRevenue = bookings.filter(b => b.property_id === p.id).reduce((sum, b) => sum + (b.amount || 0), 0)
              const pct = totalRevenue > 0 ? Math.round((propRevenue / totalRevenue) * 100) : 0
              return (
                <div key={p.id} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-white text-sm">{p.name}</span>
                    <span className="text-white text-sm">${propRevenue.toLocaleString()} <span className="text-slate-400">({pct}%)</span></span>
                  </div>
                  <div className="bg-slate-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="bg-slate-800 rounded-xl p-5">
          <h2 className="text-white font-medium mb-4">Recent Transactions</h2>
          {bookings.length === 0 ? (
            <div className="text-slate-400 text-sm">No bookings yet</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-slate-400 text-xs">
                  <th className="text-left pb-3">Guest</th>
                  <th className="text-left pb-3">Property</th>
                  <th className="text-left pb-3">Check-in</th>
                  <th className="text-left pb-3">Platform</th>
                  <th className="text-right pb-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} className="border-t border-slate-700">
                    <td className="py-3 text-white text-sm">{b.guest_name}</td>
                    <td className="py-3 text-slate-400 text-sm">{b.properties?.name || '—'}</td>
                    <td className="py-3 text-slate-400 text-sm">{new Date(b.check_in).toLocaleDateString()}</td>
                    <td className="py-3 text-slate-400 text-sm">{b.platform || '—'}</td>
                    <td className="py-3 text-green-400 text-sm text-right">+${b.amount || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}