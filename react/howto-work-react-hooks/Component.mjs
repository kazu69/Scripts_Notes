export const Component = (() => {
  // let val, deps;
  let hooks = [], currentHook = 0;
  return {
    render: (Component) => {
      const C = Component();
      C.render();
      currentHook = 0;
      return C;
    },
    useState: (initVal) => {
      // val = val || initVal;
      hooks[currentHook] = hooks[currentHook] || initVal;
      // setState clouser
      const setStateHookIndex = currentHook;

      const setState = (newVal) => {
        // val = newVal;
        hooks[setStateHookIndex] = newVal
      }

      // return [val, setState];
      return [hooks[currentHook++], setState];
    },
    useEffect: (callback, depsArray) => {
      const hasNodepsArray = !depsArray;
      const deps = hooks[currentHook];
      const hasChangedDeps = deps ? !depsArray.every((el, i) => el === deps[i]) : true;
      if (hasNodepsArray | hasChangedDeps) {
        callback();
        // deps = depsArray
        hooks[currentHook] = depsArray
      }
      currentHook++;
    }
  }
})();
