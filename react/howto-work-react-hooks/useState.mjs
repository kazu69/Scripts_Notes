export const useState = (initialValue) => {
  var val = initialValue;
  const state = () => {
    return val;
  }

  const setState = (newVal) => {
    val = newVal;
  }

  return [state, setState];
}

// var [foo, setFoo] = useState(0);
// console.log(foo());
// setFoo(1);
// console.log(foo());
