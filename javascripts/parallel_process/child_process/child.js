'use strict'

const num = [];
const count = function(start, end) {
  for(let i = start; i <= end; i++) {
    if (num.some(function(v) { return v === i }) === false) {
      num.push(i)
    }
  }
} 

module.exports = function (inp, callback) {
  if (!inp) { return }
  const {start, end} = inp;
  count(start, end);
  console.log(`${process.pid} running`);
  callback(null, num);
}
