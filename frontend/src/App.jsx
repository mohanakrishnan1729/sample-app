import { useState, useEffect } from 'react'

// ✅ No hardcoded localhost!
// In dev → Vite proxy forwards to http://localhost:5000
// In production → Nginx forwards to http://localhost:5000
const API = '/api/tasks'

function App() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(API)
        const data = await res.json()
        setTasks(data.tasks)
      } catch (err) {
        setError('❌ Cannot connect to server!')
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  const addTask = async () => {
    if (input.trim() === '') return
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input })
      })
      const data = await res.json()
      setTasks([data.task, ...tasks])
      setInput('')
    } catch (err) {
      setError('Failed to add task!')
    }
  }

  const toggleTask = async (id, completed) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      })
      const data = await res.json()
      setTasks(tasks.map(t => t._id === id ? data.task : t))
    } catch (err) {
      setError('Failed to update task!')
    }
  }

  const deleteTask = async (id) => {
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' })
      setTasks(tasks.filter(t => t._id !== id))
    } catch (err) {
      setError('Failed to delete task!')
    }
  }

  const clearAll = async () => {
    try {
      await Promise.all(tasks.map(t =>
        fetch(`${API}/${t._id}`, { method: 'DELETE' })
      ))
      setTasks([])
    } catch (err) {
      setError('Failed to clear tasks!')
    }
  }

  const remainingCount = tasks.filter(t => !t.completed).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">

        <h1 className="text-2xl font-bold text-center text-blue-600 mb-1">
          📝 Full Stack Todo App
        </h1>
        <p className="text-center text-xs text-green-500 font-medium mb-5">
          ✅ MERN + Nginx Production Ready
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-xl mb-4 text-center">
            {error}
            <button onClick={() => setError(null)} className="ml-2 font-bold">✕</button>
          </div>
        )}

        <div className="flex gap-2 mb-5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Enter a task..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition font-semibold"
          >
            Add
          </button>
        </div>

        {loading && (
          <p className="text-center text-gray-400 animate-pulse py-8">Loading tasks...</p>
        )}

        {!loading && (
          <ul className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {tasks.map(task => (
              <li key={task._id} className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-xl transition group">
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task._id, task.completed)}
                    className="w-4 h-4 accent-blue-500 cursor-pointer"
                  />
                  <span className={`text-sm flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {task.title}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-gray-300 hover:text-red-500 ml-2 font-bold text-lg transition opacity-0 group-hover:opacity-100"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {!loading && tasks.length === 0 && !error && (
          <div className="text-center py-8">
            <p className="text-4xl mb-2">🎉</p>
            <p className="text-gray-400">No tasks yet. Add one above!</p>
          </div>
        )}

        {tasks.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-400">
              {remainingCount} task{remainingCount !== 1 ? 's' : ''} remaining
            </p>
            <button
              onClick={clearAll}
              className="text-sm text-red-400 hover:text-red-600 font-semibold transition"
            >
              🗑️ Clear All
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default App
