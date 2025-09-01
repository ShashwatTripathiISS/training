import React, {useState} from 'react'
import './App.css'

type Todo = {
  id: number;
  todo: string;
  done: boolean;
}

function App() {
  const [list, setList] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [id, setId] = useState(0);
  
  const addTodo = (todo: string) => {
    const newTodo: Todo = {
      id: id,
      todo: todo,
      done: false
    };

    setId(id + 1);
    setList([...list, newTodo]);

    setInput("");
  }

  const markAsComplete = (id: number) => {
    const newList = list.map((todo) => {
      if (todo.id === id) {
        return { ...todo, done: !todo.done };
      }
      return todo;
    });

    setList(newList);
  }

  return (
    <div className="todo-container">
      <h1 className="todo-title">To Do List React-TS App</h1>
      <div className="todo-input-row">
        <input type="text" className="todo-input" value={input} onChange={(e) => setInput(e.target.value)} />
        <button className="todo-add-btn" onClick={() => addTodo(input)}>Add</button>
      </div>
      <ul className="todo-list">
        {list.map((todo) => (
          <li key={todo.id} className="todo-item">
            <button className="todo-check-btn" onClick={() => markAsComplete(todo.id)}>&#10003;</button>&nbsp;&nbsp;
            <span className={`todo-text ${todo.done ? "todo-done" : ""}`}>
              {todo.todo}
            </span>
          </li>
        )
        )}
      </ul>
    </div>
  )
}

export default App