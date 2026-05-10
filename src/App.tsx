import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Task = {
  id: number
  text: string
  completed: boolean
}

const STORAGE_KEY = 'task-board:tasks'

const loadTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (t): t is Task =>
        typeof t === 'object' &&
        t !== null &&
        typeof (t as Task).id === 'number' &&
        typeof (t as Task).text === 'string' &&
        typeof (t as Task).completed === 'boolean',
    )
  } catch {
    return []
  }
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [input, setInput] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const addTask = (e: FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setTasks([...tasks, { id: Date.now(), text, completed: false }])
    setInput('')
  }

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  const remaining = tasks.filter((t) => !t.completed).length

  return (
    <div className="app">
      <h1>Task Board</h1>

      <form className="input-row" onSubmit={addTask}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="新しいタスクを入力"
          aria-label="新しいタスク"
        />
        <button type="submit">追加</button>
      </form>

      {tasks.length === 0 ? (
        <p className="empty">タスクはまだありません</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={task.completed ? 'task completed' : 'task'}
            >
              <label className="task-main">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span className="task-text">{task.text}</span>
              </label>
              <button
                type="button"
                className="delete"
                onClick={() => deleteTask(task.id)}
                aria-label={`「${task.text}」を削除`}
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}

      {tasks.length > 0 && (
        <p className="status">
          残り {remaining} / 全 {tasks.length} 件
        </p>
      )}
    </div>
  )
}

export default App
