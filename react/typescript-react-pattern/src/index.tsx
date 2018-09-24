import {createStore, Dispatch, bindActionCreators, Action} from 'redux'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'
import { pure } from 'recompose'
import styled from 'styled-components'

// Define Action Type
enum ActionTypes {
  ADD_TODO = 'ADD_TODO',
  REMOVE_TODO = 'REMOVE_TODO'
}

// Define ActionCreator
interface AppActionWithPayload <T extends string, P extends {} = {}> {
  type: T
  payload: { [K in keyof P]: P[K] }
}

// Using Conditional Types
// https://github.com/Microsoft/TypeScript/pull/21847
// Exclude<T, U> -- Exclude from T those types that are assignable to U.
// Extract<T, U> -- Extract from T those types that are assignable to U.
// NonNullable<T> -- Exclude null and undefined from T.
// ReturnType<T> -- Obtain the return type of a function type.
// InstanceType<T> -- Obtain the instance type of a constructor function type.
type AddTodoAction = ReturnType<typeof addTodoActionCreator>
const addTodoActionCreator = (todo: string) => ({
  type: ActionTypes.ADD_TODO,
  payload: {
    todo
  },
})

type RemoveTodoAction = ReturnType<typeof removeTodoActionCreator>
const removeTodoActionCreator = (id: number) => ({
  type: ActionTypes.REMOVE_TODO,
  payload: {
    id
  },
})

// Define Action Type | Union Type
type TodoAction = AddTodoAction | RemoveTodoAction
type TodoActionCreators = {
  add: (todo: string) => AddTodoAction
  remove: (id: number) => RemoveTodoAction
}

// Define Reducer
const defaultState: { [index:string]: Array<string> } = { todos: [] }
type TodoState = typeof defaultState
const reducer = (state: TodoState = defaultState, action: TodoAction): TodoState => {
  let todos: string[];
  switch (action.type) {
    case ActionTypes.ADD_TODO:
      todos = state.todos.concat(action.payload.todo)
      return {...state, todos}
    case ActionTypes.REMOVE_TODO:
      todos = state.todos.filter((_, i) => i !== action.payload.id )
      return {...state, todos}
    default:
      return {...state}
  }
}

// Create Store
const Store = createStore(reducer)

// # Debug for Redux
// Dispatch Handler func
// const handlechange = () => {
//   console.log(`changed ${Store.getState()}`)
// }

// Store subscribed
// Store.subscribe(handlechange)
// console.log(Store.getState())
// Store.dispatch(AddTodoActionCreator('test1'))
// Store.dispatch(AddTodoActionCreator('test2'))
// console.log(Store.getState())
// Store.dispatch(removeTodoActionCreator(1))
// console.log(Store.getState())

// Define APP
type AppProps = {
  todos: string[]
  addTodo: (event: React.MouseEvent<HTMLButtonElement>) => void
  removeTodo: (event: React.ChangeEvent<HTMLInputElement>) => void
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void
  setTextInputFieldRef: (element: HTMLInputElement) => void
} & TodoActionCreators

const initialState = {
  input: ''
}

type AppState = Readonly<typeof initialState>

const StyledComponent = styled.div`
  padding: 1em;
  color: #333;

  .todo-list {
    list-style: none;
    padding-left: 0;
  }

  .todo-input-field {
    font-size: 1em;
    padding: .2em .4em;
    border-radius: .2em;
    border: 1px solid #999;
  }

  .button {
    margin-left: .8em;
    padding: .2em .4em;
    background-color: transparent;
    border: 2px solid #09c;
    border-radius: .6em;
    text-transform: uppercase;
    cursor: pointer;
    line-height: 1.4;
  }

  .button-tododelete {
    border-color: #d00;
  }
`

class App extends React.Component<AppProps, AppState> {

  private textInputFieldRef: React.RefObject<HTMLInputElement>
  readonly state = initialState

  constructor(props: AppProps) {
    super(props)
    this.addTodo = this.addTodo.bind(this)
    this.removeTodo = this.removeTodo.bind(this)
    this.changeHandler = this.changeHandler.bind(this)
    this.textInputFieldRef = React.createRef()
  }

  componentDidMount() {
    this.textInputFieldRef.current!.focus()
  }

  private changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    this.setState({input: event.target.value})
  } 

  private addTodo(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    this.props.add(this.state.input)
    this.setState({input: ''})
    this.textInputFieldRef.current!.value = ''
  }

  private removeTodo(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    const element = event.target as HTMLElement
    this.props.remove(parseInt(element.id, 10))
  }

  render() {
    const {todos} = this.props
    return (
      <StyledComponent>
        <React.Fragment>
          <TodoInputFieldWithForwardedRef
            handleChange={this.changeHandler}
            forwardRef={this.textInputFieldRef}
          />
          <AddTodoButton handleClick={this.addTodo} />
        </React.Fragment>
        <ul className="todo-list">
          {todos.map((todo:string, index: number) => {
            return <TodoItem key={index}>
              <TodoContent todoContent={todo} />
              <DeleteTodoButton 
                handleClick={this.removeTodo}
                id={index.toString()}
              />
            </TodoItem>
          })}
        </ul>
      </StyledComponent>
    )
  }
}

const defaultTodoItemProps = {}
type DefaultTodoProps = Readonly<typeof defaultTodoItemProps>
type TodoItemwithDefaultProps = DefaultTodoProps | React.StatelessComponent

// User-Defined Type Guard
// https://www.typescriptlang.org/docs/handbook/advanced-types.html
const isNamedSlots = (children: unknown): children is React.ReactChild =>
  typeof children === 'object' &&
  typeof children !== null &&
  typeof children !== undefined


const TodoItem: React.SFC<TodoItemwithDefaultProps> = ({children}) => {
  if (isNamedSlots(children)) {
    return (
      <li>
        {children}
      </li>
    )
  }

  return (
    <li className="todo-item">not exist</li>
  )
}

const defaultTodoContentProps = {
  todoContent: ''
}
type DefaultTodoContentProps = Readonly<typeof defaultTodoContentProps>
type TodoContentWidthDefaultProps = {
  todoContent: string
} & DefaultTodoContentProps

const TodoContent: React.SFC<TodoContentWidthDefaultProps> = ({todoContent} = defaultTodoContentProps) => (
  <span className="todo-content">{todoContent}</span>
)

const defaultTodoInputField = {
  id: 'todo',
  placeholder: 'Please input todo',
  name: 'todo',
}
type DefaultTodoInputField = typeof defaultTodoInputField
type TodoInputFieldWithDefaultProps = {
  handleChange(event: React.ChangeEvent<HTMLInputElement>): void
  forwardRef: React.RefObject<HTMLInputElement>
} & DefaultTodoInputField

let TodoInputField: React.SFC<TodoInputFieldWithDefaultProps> = (props) => {
  const {id, name, placeholder, handleChange, forwardRef} = props
  return (
    <input
      className="todo-input-field"
      type="text"
      id={id}
      name={name}
      placeholder={placeholder}
      onChange={handleChange}
      ref={forwardRef}
    />
  )
}

// TodoInputField.defaultProps = defaultTodoInputField
const SfcWithDefaultProps = <DP extends object, SFC extends React.SFC<P>>(defaultProps: DP, SFComponent: SFC) => {
  SFComponent.defaultProps = defaultProps
  return SFComponent
}
TodoInputField = SfcWithDefaultProps(defaultTodoInputField, TodoInputField)

type TodoInputFieldWithForwardedRefProps = {
  ref?: React.RefObject<TodoInputField>
}

// Todo: detect react props attribute spread types
const TodoInputFieldWithForwardedRef: React.RefForwardingComponent<TodoInputFieldWithForwardedRefProps> = React.forwardRef((props, ref) => (
    <TodoInputField {...props} ref={ref} />
  )
)

type ButtonElementDefaultProps = {
  readonly context?: string
}

const defaultAddTodoButtonProps:ButtonElementDefaultProps = {
  context: 'Add Todo',
}

type AddTodoButtonWithDefaultProps = {
  handleClick(event: React.MouseEvent<HTMLElement>): void
} & ButtonElementDefaultProps

const AddTodoButton: React.SFC<AddTodoButtonWithDefaultProps> = (Props) => {
  const {handleClick, context} = {...defaultAddTodoButtonProps, ...Props}
  return (
    <button className="button-todoadd button" onClick={handleClick}>{context}</button>
  )
}

const defaultDeleteTodoButtonProps: ButtonElementDefaultProps = {
  context: 'Delete Todo'
}
type DeleteTodoButtonWithDefaultProps = {
  handleClick(event: React.MouseEvent<HTMLElement>): void
  id: string
} & ButtonElementDefaultProps

const DeleteTodoButton: React.SFC<DeleteTodoButtonWithDefaultProps> = (Props) => {
  const {handleClick, id, context} = {...defaultDeleteTodoButtonProps, ...Props}
  return (
    <button className="button-tododelete button" onClick={handleClick} id={id}>{context}</button>
  )
}

const mapStateToProps = (state: TodoState) => {
  return {
    todos: state.todos
  }
}

const todoActionCreators: TodoActionCreators = {
  add: addTodoActionCreator,
  remove: removeTodoActionCreator,
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(todoActionCreators, dispatch)
}

const ConnectedApp = pure(connect(mapStateToProps, mapDispatchToProps)(App))

ReactDOM.render(
  <Provider store={Store}>
    <ConnectedApp />
  </Provider>,
  document.querySelector('#root')
)
