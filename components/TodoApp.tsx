'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { loadTodos, saveTodos } from '@/lib/storage';
import TodoItem, { Todo } from '@/components/TodoItem';

type Filter = 'all' | 'active' | 'completed';

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTodos(loadTodos());
  }, []);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const stats = useMemo(() => {
    const total = todos.length;
    const active = todos.filter(t => !t.completed).length;
    const completed = total - active;
    return { total, active, completed };
  }, [todos]);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  function handleAdd() {
    const value = text.trim();
    if (!value) return;
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: value,
      createdAt: Date.now(),
      completed: false
    };
    setTodos(prev => [newTodo, ...prev]);
    setText('');
    inputRef.current?.focus();
  }

  function handleToggle(id: string) {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function handleRemove(id: string) {
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  function handleBeginEdit(id: string) {
    setEditingId(id);
  }
  function handleSaveEdit(id: string, title: string) {
    const value = title.trim();
    if (!value) {
      setTodos(prev => prev.filter(t => t.id !== id));
    } else {
      setTodos(prev => prev.map(t => (t.id === id ? { ...t, title: value } : t)));
    }
    setEditingId(null);
  }

  function clearCompleted() {
    setTodos(prev => prev.filter(t => !t.completed));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAdd();
  }

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <div>
            <div className="title">To-Do List</div>
            <div className="counter">
              {stats.active} active ? {stats.completed} completed ? {stats.total} total
            </div>
          </div>
          <div>
            <a className="kbd" href="https://agentic-b13cbeda.vercel.app" target="_blank" rel="noreferrer">Live</a>
          </div>
        </div>

        <div className="controls">
          <input
            ref={inputRef}
            className="input"
            placeholder="Add a new task and press Enter?"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="New task title"
          />
          <button className="btn primary" onClick={handleAdd} disabled={!text.trim()}>
            Add
          </button>
          <button className="btn danger" onClick={clearCompleted} disabled={stats.completed === 0}>
            Clear completed
          </button>
        </div>

        <div className="filters" role="tablist" aria-label="Filters">
          {(['all', 'active', 'completed'] as const).map(key => (
            <button
              key={key}
              className={`filter ${filter === key ? 'active' : ''}`}
              onClick={() => setFilter(key)}
              role="tab"
              aria-selected={filter === key}
            >
              {key[0].toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>

        <div className="list">
          {visibleTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={() => handleToggle(todo.id)}
              onRemove={() => handleRemove(todo.id)}
              onBeginEdit={() => handleBeginEdit(todo.id)}
              onSaveEdit={(title) => handleSaveEdit(todo.id, title)}
              editing={editingId === todo.id}
            />
          ))}
          {visibleTodos.length === 0 && (
            <div style={{ padding: 16, color: 'var(--text-dim)', textAlign: 'center' }}>
              No tasks here. Add something above!
            </div>
          )}
        </div>

        <div className="footer">
          <div>Tip: Press Enter to quickly add a task</div>
          <div>
            <span className="kbd">Enter</span>
          </div>
        </div>
      </div>
    </div>
  );
}

