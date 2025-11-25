'use client';

import { useEffect, useRef, useState } from 'react';

export type Todo = {
  id: string;
  title: string;
  createdAt: number;
  completed: boolean;
};

export default function TodoItem({
  todo,
  onToggle,
  onRemove,
  onBeginEdit,
  onSaveEdit,
  editing
}: {
  todo: Todo;
  onToggle: () => void;
  onRemove: () => void;
  onBeginEdit: () => void;
  onSaveEdit: (title: string) => void;
  editing: boolean;
}) {
  const [title, setTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setTitle(todo.title);
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing, todo.title]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') onSaveEdit(title);
    if (e.key === 'Escape') onSaveEdit(todo.title);
  }

  return (
    <div className="item">
      <input
        type="checkbox"
        className="checkbox"
        checked={todo.completed}
        onChange={onToggle}
        aria-label={`Mark ${todo.title} ${todo.completed ? 'incomplete' : 'complete'}`}
      />

      <div className="textWrap">
        {!editing ? (
          <>
            <div className={`titleLine ${todo.completed ? 'completed' : ''}`}>{todo.title}</div>
            <div className="meta">
              {new Date(todo.createdAt).toLocaleString()}
            </div>
          </>
        ) : (
          <input
            ref={inputRef}
            className="inlineInput"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => onSaveEdit(title)}
            aria-label="Edit task title"
          />
        )}
      </div>

      <div className="itemBtns">
        {!editing && (
          <button className="btn ghost" onClick={onBeginEdit} aria-label="Edit task">
            Edit
          </button>
        )}
        <button className="btn ghost" onClick={onRemove} aria-label="Delete task" title="Delete">
          ?
        </button>
      </div>
    </div>
  );
}

