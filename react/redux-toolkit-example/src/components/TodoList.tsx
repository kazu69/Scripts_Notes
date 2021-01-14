import React from "react";
import cn from "classnames";
import { useTodosStore } from "../store/todosfacade";

const TodoList: React.FC = () => {
  const { todos, completeTodo, deleteTodo, sortTodos } = useTodosStore();
  return (
    <div className="todoList">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={cn("todo", {
            completeTodo: todo.completed
          })}
        >
          <input
            className="todoCheck"
            type="checkbox"
            checked={todo.completed}
            onChange={() => completeTodo(todo.id)}
          />
          <span className="todoMessage">{todo.message}</span>
          <button
            type="button"
            className="todoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            X
          </button>
        </div>
      ))}
      <button onClick={() => sortTodos()}>Sort 'em!</button>
    </div>
  );
};

export default React.memo(TodoList);
