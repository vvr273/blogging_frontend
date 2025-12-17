// TodoList.jsx
import { useState } from "react";
import { addTodo, toggleTodo, deleteTodo } from "../src/api/auth";
import { useOutletContext } from "react-router-dom";

export default function TodoList() {
  const { todos, setTodos } = useOutletContext();
  const [text, setText] = useState("");

  const addTask = async () => {
    if (!text.trim()) return;

    try {
      const newTodo = await addTodo(text);
      setTodos(prev => [...prev, newTodo]);    // local update
      setText("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const toggleTask = async (id) => {
    try {
      await toggleTodo(id);
      setTodos(prev =>
        prev.map(t => t._id === id ? { ...t, done: !t.done } : t)
      );
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>ToDo List 📝</h2>

      <input
        type="text"
        placeholder="Add new task"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ padding: "0.5rem", width: "60%" }}
      />

      <button
        onClick={addTask}
        style={{ padding: "0.5rem", marginLeft: "0.5rem", background: "#43d264", color: "white" }}
      >
        ➕
      </button>

      <ul style={{ marginTop: "1rem" }}>
        {todos.map(t => (
          <li key={t._id} style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
            
            <input type="checkbox" checked={t.done} onChange={() => toggleTask(t._id)} />

            <span
              style={{
                textDecoration: t.done ? "line-through" : "none",
                marginLeft: "0.5rem",
                flex: 1,
              }}
            >
              {t.text}
            </span>

            <button
              onClick={() => deleteTask(t._id)}
              style={{
                marginLeft: "0.5rem",
                background: "#dc3545",
                color: "white",
                border: "none",
                padding: "0.3rem 0.6rem",
                borderRadius: "50%",
              }}
            >
              🗑️
            </button>

          </li>
        ))}
      </ul>
    </div>
  );
}
