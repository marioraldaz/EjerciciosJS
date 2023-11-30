function asyncAdd (x, y, cb) {
  return setTimeout(function add () {
    cb(x + y)
  }, Math.random() * 20 + 20)
}
function asyncDouble (x, cb) {
  return setTimeout(function double () {
    cb(2 * x)
  }, Math.random() * 20 + 20)
}
// asyncDouble(3, function (double) {
//   asyncInc(double, function (inc) {
//     console.log(inc);
//   });
// });
function asyncCompose (g, f) {
  return function (x, cb) {
    f(x, function (result) {
      g(result, cb)
    })
  }
}
var h = asyncCompose(asyncInc, asyncDouble)
//h(3, console.log); // 7
// asyncMap, asyncFilter y asyncReduce
function asyncId (x, cb) {
  return cb(x)
}
function asyncMultiCompose (...fs) {
  const gs = fs.reverse()
  let compose = asyncId
  for (let g of gs) {
    compose = asyncCompose(g, compose)
  }
  return compose
}
// asyncMultiCompose()(4, console.log);
// asyncMultiCompose(asyncInc)(4, console.log);
// asyncMultiCompose(asyncInc, asyncDouble)(4, console.log);
// asyncMultiCompose(asyncInc, asyncInc, asyncDouble)(4, console.log);
class AsyncComposer {
  constructor (f) {
    this.f = f
  }
  then (g) {
    return new AsyncComposer(asyncCompose(g, this.f))
  }
  exec (x, cb) {
    this.f(x, cb)
  }
}
/*new AsyncComposer(asyncInc).then(asyncDouble).exec(4, console.log);
new AsyncComposer(asyncInc)
.then(asyncInc)
.then(asyncDouble)
.exec(4, console.log);*/

function asyncInc (x, cb) {
  return setTimeout(function double () {
    cb(x + 1)
  }, Math.random() * 20 + 20)
}

function asyncMap (f, xs, cb) {
  const ys = []
  let count = 0
  for (let i in xs) {
    f(xs[i], y => {
      ys[i] = y
      count++
      if (count === xs.length) {
        cb(ys)
      }
    })
  }
}
//asyncMap(asyncInc, [1, 2, 3, 4, 5], console.log);

/*const q = new AsyncComposer(asyncInc).then(asyncInc).then(asyncDouble);
q.exec(4, console.log);
q.exec(14, console.log);*/

function asyncFilter (f, xs, cb) {
  const ys = [] //Do we care about order?
  let count = 0
  for (let i in xs) {
    if (f(xs[i])) {
      ys[i] = xs[i]
      count++
    } else {
      count++
    }
    if (count === xs.length) {
      const zs = ys.filter(x => (x ? true : false)) //Necesario?
      cb(zs)
    }
  }
}

//asyncFilter((x) => x<5, [1,2,3,4,5,6,7],console.log)

class AsyncFilter {
  constructor (xs) {
    this.xs = xs
  }
  then (f) {
    asyncFilter(f, this.xs, res => (this.xs = res))
    return new AsyncFilter(this.xs)
  }
  exec (cb) {
    cb(this.xs)
  }
}

//const kk1 = new AsyncFilter([1,2,2,3,3,4,5,6,7]).then((x)=>x<7).then((x)=>x<6).then((x)=>x!=3);
//kk1.exec(console.log)

function asyncReduce (xs, f, cb) {
  let i = 0
  let y = 0
  while (i < xs.length - 1) {
    if ((y = f(y, xs[i]))) {
      i++
    }
  }
  cb(y)
}

//asyncReduce([1,2,2,3,5,6,7], (x,y) => x+y, console.log);

class AsyncReduce {
  constructor (xs) {
    this.xs = xs
  }
  then (f) {
    return new AsyncReduce(asyncReduce(this.xs, f))
  }
  exec (cb) {
    cb(this.xs)
  }
}

async function asyncMultiMap (fs, xs, cb) {
  let ys = xs
  let nextFunction = true
  let count = 0
  for (f of fs) {
    if (nextFunction) {
      nextFunction = false
      asyncMap(f, ys, res => {
        ys = res
        nextFunction = true
        count++
      })
    }
  }
  cb(ys)
}

//function asyncMap2(fs, x, callback);
asyncMultiMap([asyncInc, asyncDouble], [5], console.log)
