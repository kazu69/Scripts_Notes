import todoSlice from "./todos";

const { completeTodo, deleteTodo, addTodo, sort } = todoSlice.actions;

export const completeTodoAction = (id: string) => completeTodo(id);
export const deleteTodoAction = (id: string) => deleteTodo(id);
export const sortTodoAction = () => sort();
export const addTodoAction = (content: string) => addTodo(content);
