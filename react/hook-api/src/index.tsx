import * as React from "react";
import { render } from "react-dom";

// 1. useState
// 2. useEffect
// 4. useRef
// 5. useCallback (useMemo: return value, useCallback: return callback function)
// 6. useReducer
// React Hooks

const IncrementAction =  `increment`;
const DecrementAction = `decrement`;
const ResetAction = `reset`;
const InitAction = `init`;

type CounterAction = {
  type?: string;
};

type CountType = {
  count: number,
}

const initialState: CountType = { count: 0 };
const initAction = { type: InitAction };
const CounterState: CountType & CounterAction = Object.assign({}, initialState, initAction);
type CounterStateType = typeof CounterState;

// reducer
function reducer(state: CounterStateType, action: CounterAction) {
  switch (action.type) {
    case ResetAction:
      return initialState;
    case IncrementAction:
      return { count: state.count + 1 };
    case DecrementAction:
      return { count: state.count - 1 };
    case InitAction:
    default:
      return state;
  }
}

const Counter: React.FC<CounterStateType> = () => {

  const [state, dispatch] = React.useReducer(reducer, CounterState);

  React.useEffect(
    () => {
      document.title = `Counter count is  ${state.count}`;
    },
    [state.count]
  );

  const incrementButton = React.useRef<HTMLButtonElement>(null);
  const onResetButtonClickHandler = () => {
    if (incrementButton && incrementButton.current) {
      incrementButton.current.focus();
    }
  };

  const { increment, decrement, reset } = React.useContext(CounterContext);

  const increaseClickHandler = React.useCallback(
    () => dispatch({ type: "increment" }),
    []
  );

  const decreaseClickHandler = React.useCallback(
    () => dispatch({ type: "decrement" }),
    []
  );

  const resetClickHandler = React.useCallback(
    () => dispatch({ type: "reset" }),
    []
  );

  return (
    <div>
      <h1>Counter Example App</h1>
      <p>count: {state.count}</p>
      <button
        onClick={() => {
          resetClickHandler();
          onResetButtonClickHandler();
        }}
      >
        {reset}
      </button>
      <button onClick={increaseClickHandler} ref={incrementButton}>
        {increment}
      </button>
      <button onClick={decreaseClickHandler}>{decrement}</button>
    </div>
  );
};

// 3. useContext
const CounterContext = React.createContext({
  increment: "increment (+)",
  decrement: "decrement (-)",
  reset: "reset (0)"
});

const App = () => {
  return (
    <div>
      <Counter count={1} />
    </div>
  );
};

render(<App />, document.getElementById("root"));
