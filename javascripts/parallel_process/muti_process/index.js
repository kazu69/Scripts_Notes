
'use strict'

let workerFarm = require('worker-farm'),
    process    = require('process'),
    workers    = workerFarm(require.resolve('./child'));

let num = [];
const start = 0,
      end = 50000;

const child_prosess = require('os').cpus().length;

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

const ranges = range(start, end, child_prosess);
ranges[ranges.length - 1].end += (end % child_prosess);

for (let i = 0; i <= child_prosess; i++) {
  workers(ranges[i], function (err, outp) {
    if (err) {
      console.error(err);
    }
    num = num.concat(outp)
    if (i == child_prosess - 1) {
      workerFarm.end(workers);
      const result = num.reduce(function(prev, current, _, __) {
        return prev + current;
      });
      console.log(result);
      process.on('exit', function() {
        process.exit(0);
      });
    }
  });
}
