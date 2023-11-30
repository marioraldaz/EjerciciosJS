function asyncAdd (x, y, cb) {
  setTimeout(function add () {
    cb(x + y)
  }, Math.random() * 20 + 20)
}

function asyncInc (x, cb) {
  setTimeout(function double () {
    cb(x + 1)
  }, Math.random() * 20 + 20)
}

function asyncDouble (x, cb) {
  setTimeout(function double () {
    cb(2 * x)
  }, Math.random() * 20 + 20)
}

function asyncCompose (g, f) {
  return function (x, cb) {
    f(x, function (result) {
      g(result, cb)
    })
  }
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

const promiseCompose = (x, y) =>
  new Promise(function (resolve, reject) {
    asyncCompose(x, y, resolve)
  })

const promiseMap = (f, xs) =>
  new Promise(function (resolve, reject) {
    asyncMap(f, xs, resolve)
  })

const promiseFilter = (f, xs) =>
  new Promise(function (resolve, reject) {
    asyncFilter(f, xs, resolve)
  })
const promiseReduce = (xs, f) =>
  new Promise(function (resolve, reject) {
    asyncReduce(xs, f, resolve)
  })

const promiseAdd = (x, y) =>
  new Promise(function (resolve, reject) {
    asyncAdd(x, y, resolve)
  })

const promiseInc = x =>
  new Promise(function (resolve, reject) {
    asyncInc(x, resolve)
  })

const promiseDouble = x =>
  new Promise(function (resolve, reject) {
    asyncDouble(x, resolve)
  })

promiseAdd(4, 5).then(promiseInc).then(console.log)

//compose, map, filter, reduce

async function test () {
  let result = await promiseAdd(4, 5)
  result = await promiseInc(result)
  result = await promiseInc(result)
  result = await promiseDouble(result)
  result = await promiseInc(result)
  return result
}

test().then(console.log)

async function test2 () {
  var fs = [promiseDouble, promiseInc]
  var x = 4
  for (f of fs) {
    x = await f(x)
  }

  return x
}

test2().then(console.log)

async function test3 () {
  return 5555
}

test3()
  .then(result => result * 2)
  .then(console.log)

Promise.resolve(45).then(console.log)
