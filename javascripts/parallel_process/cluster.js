const cluster = require('cluster');

let num = [];
const start = 0,
      end = 100;

const count = (start, end) => {
  const tmp = [];
  for(let i = start; i <= end; i++) {
    if (num.some((v)  => { return v === i }) === false) {
      tmp.push(i)
    }
  }
  return tmp;
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

const child_prosess = require('os').cpus().length;

const messageReceive = () => {
  return new Promise((resolve, reject) => {
    let finichProcess = 0;
    cluster.on('message', (worker ,message, handle) => {
      finichProcess++;
      num = num.concat(message)
      if (finichProcess === child_prosess) {
        resolve(num);
      }
    });
  });
}

const mainFunction = () => {
  const ranges = range(start, end, child_prosess);
  ranges[ranges.length - 1].end += (end % child_prosess);
  for (let i = 0; i < child_prosess; i++) {
    let worker = cluster.fork();
    worker.on('online', () => {
      worker.send(ranges[i]);
    });
  }

  const promise = messageReceive();
  promise.then((num) => {
    const result =  num.reduce((prev, current, _, __) => {
      return prev + current;
    });
    console.log(result);
  });
}

const childProcessFunc = () => {
  process.on('message', (data) => {
    const response = count(data.start, data.end);
    process.send(response);
    cluster.worker.disconnect();
  });
}

(async () => {
  if (cluster.isMaster) {
    mainFunction();
  } else {
    childProcessFunc();
  }
})();
