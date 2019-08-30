// import TimeElapsedClass from './TimeElapsedClass';
import timeElapsedClass from './timeElapsedClassTwo';
import timeElapsedModule from './timeElapsedModule';

const timeElapsedClass1 = new timeElapsedClass();
const timeElapsedClass2 = new timeElapsedClass();

const timeElapsedModule1 = timeElapsedModule();
const timeElapsedModule2 = timeElapsedModule();

// ------------------------------------------------------------------------

// https://tc39.github.io/ecma262/#sec-date.now
// new Date().getTime()

// closure: the combination of a function and the lexical environment within which that function was declared
// lexical environment: consists of any local variables that were in-scope at the time the closure was created
// closures are useful because they let you associate some data (lexical environment) with a function that operates on that data
// use a closure anywhere an object with only a single method might be used
// functions in JS form closures

// Closure Scope Chain (closures have 3 scopes):
//  1) Local Scope (the closure's scope)
//  2) Outer Functions Scope (lexical env)
//  3) Global Scope (root)
//  ***** all closures have access to all outer function scopes within which they were declared *****

function closureFuncDemo1(lexicalEnvVar) {
  return function(y) {
    return `${lexicalEnvVar}-${y}`;
  };
}

// ------------------------------------------------------------------------

export function getRandomInt() {
  return Math.floor(Math.random() * (100 - 1)) + 1;
}

function basicPromiseResolveRejectImmediate(p) {
  return new Promise((resolve, reject) => {
    if (p) {
      resolve('>>>>>>>>>>> mockAPI > basicPromise > PROMISE is TRUE <<<<<<<<<<<<<');
    } else {
      reject('>>>>>>>>>>> mockAPI > basicPromise > PROMISE is FALSE <<<<<<<<<<<<<');
    }
  });
}

function basicPromiseResolvePending() {
  return new Promise(resolve => {
    setTimeout(() => resolve( {
      city: 'New York',
      forecast: 'partly cloudy'
    } ), 200);
  });
}

function awaitForReturnValueOfAFunction(r) {
  return r;
}

function startSetTimeout(delay) {
  // setTimeout(() => console.log('###### mockAPI > startSetTimeout > secondsElapsed: ', timeElapsedClass1.getSecondsElapsed()), delay);
  setTimeout(() => console.log('###### mockAPI > startSetTimeout > secondsElapsed: ', timeElapsedModule1.getSecondsElapsed()), delay);
}

function startResolvedPromise(delay) {
  return new Promise(resolve => {
    setTimeout(() => resolve( timeElapsedModule1.getSecondsElapsed() ), delay);
    // setTimeout(() => resolve( timeElapsedClass1.getSecondsElapsed() ), delay);
  });
}

function startResolvedRejectedPromise(v, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (v === 'resolve') {
        resolve({
          value: `${v}`,
          // timeElapsed: timeElapsedClass1.getSecondsElapsed(),
          timeElapsed: timeElapsedModule1.getSecondsElapsed(),
          time: Date.now(),
          delay: `${delay}`,
          message: 'RESOLVED! This came from the mock API.'
        });
      } else {
        reject({
          value: `${v}`,
          // timeElapsed: timeElapsedClass1.getSecondsElapsed(),
          timeElapsed: timeElapsedModule1.getSecondsElapsed(),
          time: Date.now(),
          delay: `${delay}`,
          message: 'REJECTED! This came from the mock API.'
        });
      }
    }, delay);
  });
};

// setTimeout() is the asynchronous 'task' and it executes in 'delay' seconds
// after setTimeout() delay, 'resolve/reject' function is then 'called' through 'if/else'
// calling 'resolve/reject' function returns the results of the 'task' as a value
function postRequestConcatResolveRejectPromise(dataObj, r, delay) {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (r === 'resolve') {
        resolve({
          value: `${r}`,
          timeElapsed: timeElapsedModule1.getSecondsElapsed(),
          time: Date.now(),
          delay: `${delay}`,
          message: 'RESOLVED! 200 - Data Found.',
          status: 200,
          data: dataObj.data.concat(dataObj.newData)
        });
      } else {
        reject({
          value: `${r}`,
          timeElapsed: timeElapsedModule1.getSecondsElapsed(),
          time: Date.now(),
          delay: `${delay}`,
          message: 'REJECTED! 404 - Data Not Found.',
          status: 404,
          // data: dataObj.data
        });
      }
    }, delay);
  });
  console.log('###### mockAPI > postRequestConcatResolveRejectPromise(1600) PPPPPPPP: ', promise);
  return promise;
};

// promise.all: rejects with reason of 1st promise that rejects
// async always return a promise
// await suspends execution until the promise is settled
// async/await: take advantage of the generator pattern
// async/await: make asynchronous operations with promises work in an synchronous manner

// async returns a promise, which can be resolved to a value
// await suspends the execution until the promise is settled
// obj instanceof Promise

async function doSomeAsyncSyncLikeOperations() {

  //console.log(`###### mockAPI > doSomeAsyncSyncLikeOperations > timeElapsedClass1.getSecondsElapsed 1: ${timeElapsedClass1.getSecondsElapsed()}`);
  console.log(`###### mockAPI > doSomeAsyncSyncLikeOperations > timeElapsedModule1.getSecondsElapsed() 1: ${timeElapsedModule1.getSecondsElapsed()}`);

  // -------------------------

  const p = await startResolvedPromise(1500);
  console.log('###### mockAPI > doSomeAsyncSyncLikeOperations > startResolvedPromise(1500) > secondsElapsed p: ', p);

  // -------------------------

  startSetTimeout(10000);

  // -------------------------

  const g = await startResolvedPromise(4000);
  console.log('###### mockAPI > doSomeAsyncSyncLikeOperations > startResolvedPromise(4000) > secondsElapsed g: ', g);

  // -------------------------

  const b = await startResolvedPromise(100);
  console.log('###### mockAPI > doSomeAsyncSyncLikeOperations > startResolvedPromise(100) > secondsElapsed b: ', b);

  const z = await startResolvedPromise(4000);
  console.log('###### mockAPI > doSomeAsyncSyncLikeOperations > startResolvedPromise(4000) > secondsElapsed z: ', z);

  // -------------------------

  // try {
  //   const k = await startResolvedRejectedPromise('foober', 1200);
  //   return k;
  // } catch (error) {
  //   console.log('###### mockAPI > doSomeAsyncSyncLikeOperations > startResolvedRejectedPromise > k catch > error: ', error);
  //   return error;
  // }

  //console.log(`###### mockAPI > doSomeAsyncSyncLikeOperations > timeElapsedClass1.getSecondsElapsed 2: ${timeElapsedClass1.getSecondsElapsed()}`);
  console.log('###### mockAPI > doSomeAsyncSyncLikeOperations > timeElapsedModule1.getSecondsElapsed() 2: ', timeElapsedModule1.getSecondsElapsed());

  timeElapsedClass2.setStartTime();
  timeElapsedModule2.setStartTime();

  console.log('###### mockAPI > doSomeAsyncSyncLikeOperations > timeElapsedClass1.getStartTime(): ', timeElapsedClass1.getStartTime());
  console.log('###### mockAPI > doSomeAsyncSyncLikeOperations > timeElapsedClass2.getStartTime(): ', timeElapsedClass2.getStartTime());

  console.log('###### mockAPI > doSomeAsyncSyncLikeOperations > timeElapsedModule1.getStartTime(): ', timeElapsedModule1.getStartTime());
  console.log('###### mockAPI > doSomeAsyncSyncLikeOperations > timeElapsedModule2.getStartTime(): ', timeElapsedModule2.getStartTime());
}

// ------------------------------------------------------------------------

function doSomePromiseAll() {

  const timeoutArrayLong = [];
  timeoutArrayLong.push(startResolvedPromise(2500));
  timeoutArrayLong.push(startResolvedPromise(22250));

  // non-promise iterable values are ignored, but counted in the returned promise array
  const timeoutArrayFast = [];
  timeoutArrayFast.push(startResolvedPromise(100));
  timeoutArrayFast.push(9999999);
  timeoutArrayFast.push(startResolvedPromise(300));
  timeoutArrayFast.push('FooooooBerrrrrrrrr');

  const pAlong = Promise.all(timeoutArrayLong);

  pAlong
    .then(values => {
      console.log('###### mockAPI > doSomePromiseAll > timeoutArrayLong1-0: ', values[0]);
      console.log('###### mockAPI > doSomePromiseAll > timeoutArrayLong1-1: ', values[1]);
    })

  const pAfast = Promise.all(timeoutArrayFast);

  pAfast
    .then(values => {
      console.log('###### mockAPI > doSomePromiseAll > timeoutArrayFast1-0: ', values[0]);
      console.log('###### mockAPI > doSomePromiseAll > timeoutArrayFast1-1: ', values[1]);
      console.log('###### mockAPI > doSomePromiseAll > timeoutArrayFast1-2: ', values[2]);
      console.log('###### mockAPI > doSomePromiseAll > timeoutArrayFast1-3: ', values[3]);
    })
}

// =========================================================================
// =========================================================================

export async function getSomeAsyncData(location) {

  console.log('###### mockAPI > getSomeAsyncData > location: ', location);

  timeElapsedClass1.setStartTime();
  timeElapsedModule1.setStartTime();

  // doSomeAsyncSyncLikeOperations();
  // await doSomeAsyncSyncLikeOperations();

  const response = await startResolvedRejectedPromise('resolve', 1200);
  console.log('###### mockAPI > getSomeAsyncData > startResolvedRejectedPromise(1600) response: ', response);
  return await response;
}

// ------------------------------------------------------------------------

export function postRequestConcatExportASYNC(req) {

  console.log('###### mockAPI > postRequestConcatExportASYNC > req: ', req);

  timeElapsedModule1.setStartTime();

  // doSomePromiseAll();

  const promise = postRequestConcatResolveRejectPromise(req, 'resolve', 1600);
  console.log('###### mockAPI > postRequestConcatExportASYNC > postRequestConcatResolveRejectPromise(1600) PROMISE: ', promise);

  // not passing value as next result here / not chaining
  // promise.then(result => {
  //   console.log('###### mockAPI > postRequestConcatExportASYNC > postRequestConcatResolveRejectPromise(1600) PROMISE.THEN1:', result);
  //   return result;
  // });

  // promise.then(result => {
  //   console.log('###### mockAPI > postRequestConcatExportASYNC > postRequestConcatResolveRejectPromise(1600) PROMISE.THEN2:', result);
  //   return result;
  // });

  // pending promise now fulfilled or rejected
  // chaining - returned handler value is result of next chained handler
  // a sequence of asynchronous tasks done one after another
  const thenProm = promise
    .then(result => {
      console.log('###### mockAPI > postRequestConcatExportASYNC > postRequestConcatResolveRejectPromise(1600) PROMISE.THEN1:', result);
      result.message += ' P1,'
      return result;
    })
    .then(result => {
      console.log('###### mockAPI > postRequestConcatExportASYNC > postRequestConcatResolveRejectPromise(1600) PROMISE.THEN2:', result);
      result.message += ' P2,'
      return result;
    })
    .then(result => {
      console.log('###### mockAPI > postRequestConcatExportASYNC > postRequestConcatResolveRejectPromise(1600) PROMISE.THEN3:', result);
      result.message += ' P3,'
      return result;
    })
  // handle rejected promise in action creator (closest rejection handler)
  //   .catch(error => {
  //     console.log('###### mockAPI > postRequestConcatExportASYNC > postRequestConcatResolveRejectPromise(1600) CATCH:ERROR:', error);
  //     return Promise.reject(error);
  //     throw error;
  //   });

  return thenProm;
  // return promise;
}

// ------------------------------------------------------------------------

export async function postRequestConcatExportSYNC(req) {

  console.log('###### mockAPI > postRequestConcatExportSYNC > req: ', req);

  timeElapsedModule1.setStartTime();

  // resolved promise object returned
  let promise = await postRequestConcatResolveRejectPromise(req, 'resolve', 1600);
  console.log('###### mockAPI > postRequestConcatExportSYNC > postRequestConcatResolveRejectPromise(1600) PROMISE: ', promise);

  // return await promise;
  return promise;
}

// ------------------------------------------------------------------------

export function mockAPI(doWhat, delay) {
  console.log('###### export function mockAPI <<<<<<<<<<<<<<<<<<<<<<<');
  return new Promise(( resolve ) => {
    setTimeout( () => resolve( doWhat() ), delay);
  });
}
