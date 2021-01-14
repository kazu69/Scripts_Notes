import React, { useState } from "react";
import { useTodosStore } from "../store/todosfacade";

const TodoInput: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const { addTodo } = useTodosStore();
  return (
    <form
      className="todoInput"
      onSubmit={(event) => {
        event.preventDefault();
        addTodo(inputValue);
        setInputValue("");
      }}
    >
      <label htmlFor="todo-input">Enter Todo Here</label>
      <input
        id="todo-input"
        value={inputValue}
        onChange={(event) => setInputValue(event.currentTarget.value)}
      />
      <button type="submit">Add Todo</button>
    </form>
  );
};

export default React.memo(TodoInput);
