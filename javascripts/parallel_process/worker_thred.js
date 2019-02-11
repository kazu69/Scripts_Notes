'use strict';
const {
  Worker,
  isMainThread,
  parentPort,
  workerData
} = require('worker_threads');

let num = [];
let start = 0;
let end = 50000;

const count = function(start, end) {
  for(let i = start; i <= end; i++) {
    if (num.some(function(v) { return v === i }) === false) {
      num.push(i)
    }
  }
} 

const range = (start, end, separate) => {
  const result = [];
  const count = (end - start) / separate;

  for (let i = 0; i < separate; i++) {
    let tmp = {};
    if (i == 0) {
      tmp = {
        start,
        end: count,
      };
    } else {
      tmp = {
        start: result[i - 1].end + 1,
        end: result[i - 1].end + count,
      }
    }
    result.push(tmp);
  }
  return result;
}

if (isMainThread) {
  const threadCount = +process.argv[2] || 2,
        ranges = range(start, end, threadCount),
        threads = new Set();

  ranges[ranges.length - 1].end += (end % threadCount);

  for (let i = 1; i < threadCount; i++) {
    threads.add(new Worker(__filename, { workerData: { start: ranges[i].start, end: ranges[i].end }}));
  }

  threads.add(new Worker(__filename, { workerData: { start: ranges[0].start, end: ranges[0].end }}));

  for (let worker of threads) {
    worker.on('error', (err) => { throw err; });
    worker.on('online', () => {
      console.log(`Thread running start ID: ${worker.threadId} ...`);
    });
    worker.on('exit', () => {
      console.log(`Total thread, ${threads.size} running ...`);
      threads.delete(worker);
      if (threads.size === 0) {
        const result = num.reduce(function(prev, current, _, __) {
          return prev + current;
        });
        console.log(result)
      }
    })
    worker.on('message', (msg) => {
      num = num.concat(msg);
    });
  }
} else {
  count(workerData.start, workerData.end);
  parentPort.postMessage(num);
}
