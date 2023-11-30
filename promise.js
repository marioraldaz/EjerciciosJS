function asyncAdd(x, y, cb) {
    setTimeout(function add() {
        cb(x + y);
    }, Math.random() * 20 + 20);
}

function asyncInc(x, cb) {
    setTimeout(function double() {
        cb(x + 1);
    }, Math.random() * 20 + 20);
}

function asyncDouble(x, cb) {
    setTimeout(function double() {
        cb(2 * x);
    }, Math.random() * 20 + 20);
}

function asyncCompose(g, f) {
return function (x, cb) {
    f(x, function (result) {
        g(result, cb);
    });
};
}

const promiseAdd = (x, y) =>
new Promise(function (resolve, reject) {
    asyncAdd(x, y, resolve);
});

const promiseInc = (x) =>
new Promise(function (resolve, reject) {
    asyncInc(x, resolve);
});

const promiseDouble = (x) =>
new Promise(function (resolve, reject) {
    asyncDouble(x, resolve);
});

promiseAdd(4, 5).then(promiseInc).then(console.log);

//compose, map, filter, reduce

async function test() {
let result = await promiseAdd(4, 5);
result = await promiseInc(result);
result = await promiseInc(result);
result = await promiseDouble(result);
result = await promiseInc(result);
return result;
}

test().then(console.log);

async function test2() {
var fs = [promiseDouble, promiseInc];
var x = 4;
for (f of fs) {
    x = await f(x);
}

return x;
}

test2().then(console.log);

async function test3() {
return 5555;
}

test3()
.then((result) => result * 2)
.then(console.log);

Promise.resolve(45).then(console.log);


