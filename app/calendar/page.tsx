'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export default function Calendar() {
  const [bookings, setBookings] = useState<any[]>([])
  const [date, setDate] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() })

  useEffect(() => {
    supabase.from('bookings').select('*, properties(name)').then(({ data }) => setBookings(data || []))
  }, [])

  const firstDay = new Date(date.year, date.month, 1).getDay()
  const daysInMonth = new Date(date.year, date.month + 1, 0).getDate()
  const cells = Array.from({ length: Math.ceil((firstDay + daysInMonth) / 7) * 7 }, (_, i) => {
    const day = i - firstDay + 1
    return day > 0 && day <= daysInMonth ? day : null
  })

  function getBookingsForDay(day: number) {
    return bookings.filter(b => {
      const ci = new Date(b.check_in), co = new Date(b.check_out)
      const d = new Date(date.year, date.month, day)
      return d >= ci && d <= co
    })
  }

  const colors = ['bg-blue-500/30 text-blue-300', 'bg-green-500/30 text-green-300', 'bg-yellow-500/30 text-yellow-300', 'bg-pink-500/30 text-pink-300']

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
          <a href="/calendar" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm">📅 Calendar</a>
          <a href="/revenue" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white text-sm">💰 Revenue</a>
          <a href="/marketing" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white text-sm">📣 Marketing</a>
          <a href="/tasks" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white text-sm">✅ Tasks</a>
        </nav>
      </div>
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-2xl font-medium">Calendar</h1>
          <div className="flex items-center gap-3">
            <button onClick={() => setDate(d => ({ ...d, month: d.month === 0 ? 11 : d.month - 1, year: d.month === 0 ? d.year - 1 : d.year }))} className="text-slate-400 hover:text-white w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">‹</button>
            <span className="text-white font-medium w-36 text-center">{MONTHS[date.month]} {date.year}</span>
            <button onClick={() => setDate(d => ({ ...d, month: d.month === 11 ? 0 : d.month + 1, year: d.month === 11 ? d.year + 1 : d.year }))} className="text-slate-400 hover:text-white w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">›</button>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-7 border-b border-slate-700">
            {DAYS.map(d => <div key={d} className="p-3 text-center text-slate-400 text-xs font-medium">{d}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              const dayBookings = day ? getBookingsForDay(day) : []
              const isToday = day === new Date().getDate() && date.month === new Date().getMonth() && date.year === new Date().getFullYear()
              return (
                <div key={i} className="min-h-24 p-2 border-b border-r border-slate-700">
                  {day && (
                    <>
                      <div className={`w-6 h-6 flex items-center justify-center text-xs mb-1 rounded-full ${isToday ? 'bg-blue-500 text-white' : 'text-slate-400'}`}>{day}</div>
                      {dayBookings.map((b, bi) => (
                        <div key={b.id} className={`text-xs px-1 py-0.5 rounded mb-0.5 truncate ${colors[bi % colors.length]}`}>
                          {b.guest_name}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}