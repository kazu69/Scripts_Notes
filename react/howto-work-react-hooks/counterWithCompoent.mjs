import { Component } from './Component';

const Counter = () => {
  const [count, setCount] = Component.useState(0);
  const [text, setText] = Component.useState('foo');

  const useSplitURL = (str) => {
    const [text, setText] = Component.useState(str);
    let masked = text;
    if (text && typeof text.split === 'function') {
      masked = text.split('.');
    }
    return [masked, setText];
  }
  const [splitedUrlArray, splitUrl] = useSplitURL(null);

  Component.useEffect(
    () => { console.log('effect', count, text, splitedUrlArray)},
    [count, text, splitedUrlArray]
  );
  return {
    countUp: () => setCount(count + 1),
    type: txt => setText(txt),
    url: str => splitUrl(str),
    noop: () => setCount(count),
    render: () => console.log('render:', { count, text, splitedUrlArray })
  }
}

let App = Component.render(Counter);
App.countUp();
Component.render(Counter);
App.type('bar');
App.url('www.reactjs.org');
App.noop();
App.countUp();
Component.render(Counter);