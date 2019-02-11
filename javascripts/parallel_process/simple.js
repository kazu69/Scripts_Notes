'use strict';
const num = [],
      start = 0,
      end = 50000;

const count = function(start, end) {
  for(let i = start; i <= end; i++) {
    if (num.some(function(v) { return v === i }) === false) {
      num.push(i)
    }
  }
} 

count(start, end);
console.log(num.length)
const result =  num.reduce(function(prev, current, _, __) {
  return prev + current;
});

console.log(result);
