import React, { useState, useRef,useEffect } from "react";
import "./Todo.css";

const Todo = () => {
  const [tasks, setTasks] = useState(() => {
  const stored = localStorage.getItem("tasks");
  return stored ? JSON.parse(stored) : [];
});
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [editedValue, setEditedValue] = useState('');
  const inputRef = useRef(null);
  useEffect(() => {
      const storedTasks = JSON.parse(localStorage.getItem("tasks"));
      if (storedTasks) setTasks(storedTasks);
    }, []);

    // 💾 Save tasks to local storage whenever it changes
    useEffect(() => {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);
  const addTask = () => {
    const value = inputRef.current.value.trim();
    if (value === '') {
      setError("Task can't be empty");
      return;
    }
    const alreadyExist = tasks.some(
      (item) => item.text.toLowerCase() === value.toLowerCase()
    );
    if (alreadyExist) {
      setError("Task already exists");
    } else {
      setTasks((prev) => [{ text: value, completed: false }, ...prev]);
      setError('');
    }
    inputRef.current.value = '';
  };

  const handleDelete = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleComplete = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  const startEditing = (index) => {
    if (!tasks[index].completed) {
      setIsEditing(index);
      setEditedValue(tasks[index].text);
      setError('');
    }
  };

  const handleSave = (index) => {
    const trimmed = editedValue.trim();
    if (trimmed === '') {
      setError("Task can't be empty");
      return;
    }
    const alreadyExist = tasks.some(
      (t, i) => i !== index && t.text.toLowerCase() === trimmed.toLowerCase()
    );
    if (alreadyExist) {
      setError("Task already exists");
      return;
    }
    const updated = [...tasks];
    updated[index].text = trimmed;
    setTasks(updated);
    setIsEditing(null);
    setEditedValue('');
    setError('');
  };

  const handleKeyPress = (e, index) => {
    if (e.key === 'Enter') {
      handleSave(index);
    }
  };

  return (
    <div className="todo-container">
      <h2>My Tasks</h2>
      <div className="input-group">
        <input type="text" ref={inputRef} placeholder="Enter a new task..." />
        <button onClick={addTask}>Add Task</button>
      </div>
      {error && <p className="error">{error}</p>}

      <ul>
        {tasks.map((task, index) => (
          <li key={index} className="todo-item">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(index)}
              className="todo-checkbox"
            />
            {isEditing === index ? (
              <input
                type="text"
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, index)}
                onBlur={() => handleSave(index)}
                autoFocus
                className="todo-edit-input"
              />
            ) : (
              <span
                onClick={() => startEditing(index)}
                className={`todo-text${task.completed ? " completed" : ""}${task.completed ? " disabled" : ""}`}
              >
                {task.text}
              </span>
            )}

            <button
              onClick={() => handleDelete(index)}
              className="todo-delete-btn"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
