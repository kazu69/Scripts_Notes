import uuid from "uuid/v4";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Todo {
  id: string;
  message: string;
  completed: boolean;
}

const initialState: Todo[] = [];

const todos = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.push({ id: uuid(), message: action.payload, completed: false });
      return state;
    },
    deleteTodo: (state, action: PayloadAction<string>) =>
      state.filter((todo) => todo.id !== action.payload),
    completeTodo: (state, action: PayloadAction<string>) => {
      const completedTodo = state.find((todo) => todo.id === action.payload);
      completedTodo.completed = true;
      return state;
    },
    sort: (state) => state.sort((a, b) => a.message.localeCompare(b.message))
  }
});

export default todos;
