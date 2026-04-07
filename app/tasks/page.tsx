'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([])
  const [properties, setProperties] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', property_id: '', due_date: '', priority: 'medium' })

  useEffect(() => {
    fetchTasks()
    supabase.from('properties').select('*').then(({ data }) => setProperties(data || []))
  }, [])

  async function fetchTasks() {
    const { data } = await supabase.from('tasks').select('*, properties(name)').order('due_date')
    setTasks(data || [])
  }

  async function addTask() {
    if (!form.title) return
    await supabase.from('tasks').insert([{
      title: form.title,
      property_id: form.property_id || null,
      due_date: form.due_date || null,
      priority: form.priority,
      done: false
    }])
    setForm({ title: '', property_id: '', due_date: '', priority: 'medium' })
    setShowForm(false)
    fetchTasks()
  }

  async function toggleTask(id: string, done: boolean) {
    await supabase.from('tasks').update({ done: !done }).eq('id', id)
    fetchTasks()
  }

  async function deleteTask(id: string) {
    await supabase.from('tasks').delete().eq('id', id)
    fetchTasks()
  }

  const priorityColor: any = { high: 'text-red-400 bg-red-500/20', medium: 'text-yellow-400 bg-yellow-500/20', low: 'text-green-400 bg-green-500/20' }
  const pending = tasks.filter(t => !t.done)
  const done = tasks.filter(t => t.done)

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
          <a href="/marketing" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white text-sm">📣 Marketing</a>
          <a href="/tasks" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm">✅ Tasks</a>
        </nav>
      </div>
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-2xl font-medium">Tasks</h1>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600">
            + Add Task
          </button>
        </div>

        {showForm && (
          <div className="bg-slate-800 rounded-xl p-5 mb-6">
            <h2 className="text-white font-medium mb-4">New Task</h2>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Task title *" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm outline-none col-span-2" />
              <select value={form.property_id} onChange={e => setForm({...form, property_id: e.target.value})} className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm outline-none">
                <option value="">No property</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm outline-none">
                <option value="high">High priority</option>
                <option value="medium">Medium priority</option>
                <option value="low">Low priority</option>
              </select>
              <input type="datetime-local" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={addTask} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600">Save Task</button>
              <button onClick={() => setShowForm(false)} className="text-slate-400 px-4 py-2 rounded-lg text-sm hover:text-white">Cancel</button>
            </div>
          </div>
        )}

        <div className="bg-slate-800 rounded-xl p-5 mb-4">
          <h2 className="text-white font-medium mb-4">Pending ({pending.length})</h2>
          {pending.length === 0 ? (
            <div className="text-slate-400 text-sm">No pending tasks 🎉</div>
          ) : pending.map(t => (
            <div key={t.id} className="flex items-center gap-3 py-3 border-b border-slate-700 last:border-0">
              <div onClick={() => toggleTask(t.id, t.done)} className="w-5 h-5 rounded border border-slate-500 flex-shrink-0 cursor-pointer hover:border-blue-400"></div>
              <div className="flex-1">
                <div className="text-white text-sm">{t.title}</div>
                <div className="text-slate-400 text-xs">{t.properties?.name} {t.due_date ? '· ' + new Date(t.due_date).toLocaleDateString() : ''}</div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${priorityColor[t.priority]}`}>{t.priority}</span>
              <button onClick={() => deleteTask(t.id)} className="text-slate-600 hover:text-red-400 text-xs">✕</button>
            </div>
          ))}
        </div>

        {done.length > 0 && (
          <div className="bg-slate-800 rounded-xl p-5">
            <h2 className="text-white font-medium mb-4">Completed ({done.length})</h2>
            {done.map(t => (
              <div key={t.id} className="flex items-center gap-3 py-3 border-b border-slate-700 last:border-0">
                <div onClick={() => toggleTask(t.id, t.done)} className="w-5 h-5 rounded border border-blue-500 bg-blue-500 flex-shrink-0 cursor-pointer flex items-center justify-center text-white text-xs">✓</div>
                <div className="flex-1">
                  <div className="text-slate-400 text-sm line-through">{t.title}</div>
                </div>
                <button onClick={() => deleteTask(t.id)} className="text-slate-600 hover:text-red-400 text-xs">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}