import { useState } from './useState';

const Counter = () => {
  const [count, setCount] = useState(0);
  return {
    countUp: () => setCount(count() + 1),
    render: () => console.log('render:', { count: count() })
  }
}

const C = Counter();
C.render();
C.countUp();
C.render();
