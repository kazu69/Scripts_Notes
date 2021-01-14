import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppState, AppDispatch } from "../store/store";
import {
  addTodoAction,
  completeTodoAction,
  deleteTodoAction,
  sortTodoAction
} from "./todos.action";

export const useTodosStore = () => {
  const dispatch: AppDispatch = useDispatch();
  const todoSelect = (state: AppState) => state.todos;
  const todos = useSelector(todoSelect);
  const addTodo = useCallback(
    (content: string) => dispatch(addTodoAction(content)),
    [dispatch]
  );
  const completeTodo = useCallback(
    (id: string) => dispatch(completeTodoAction(id)),
    [dispatch]
  );
  const deleteTodo = useCallback(
    (id: string) => dispatch(deleteTodoAction(id)),
    [dispatch]
  );
  const sortTodos = useCallback(() => dispatch(sortTodoAction()), [dispatch]);
  return {
    todoSelect,
    todos,
    addTodo,
    completeTodo,
    deleteTodo,
    sortTodos
  };
};
