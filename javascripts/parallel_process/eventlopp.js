'use strict';
const num = [],
      start = 0,
      end = 50000;

process.on('count', function(c) {
  if (c > end) {
    console.log(num.length);
    const result = num.reduce(function(prev, current, _, __) {
      return prev + current;
    });
    console.log(result);
    return;
  }
  num.push(c);

  setImmediate(function() {
    process.emit('count', ++c);
  });
});

process.emit('count', start);
