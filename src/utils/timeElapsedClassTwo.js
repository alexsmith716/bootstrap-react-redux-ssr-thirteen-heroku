
// 'this': placeholder for a specific instance
// 'this': (will be known by the time the method is invoked)

// anonymous class expression
// constructor property is optional
// object properties:
// data property ('key: value' - set in constructor, not on the prototype)
// dynamic properties also called accessor properties (getter and a setter)
// function properties (methods)

// defining a method or property on an instance override's version in the prototype
// JS first checks instance before checking prototype

const data = new WeakMap();

const timeElapsedClass = class {

  // initialize instance
  constructor() {
    // this._startTime = Date.now();
    data.set(this, {
      startTime: 0
    });
  }

  // instance methods -----------------------
  setStartTime() {
    // this._startTime = Date.now();
    data.get(this).startTime = Date.now();
  }

  getStartTime() {
    // return this._startTime;
    return data.get(this).startTime;
  }

  getSecondsElapsed() {
    return (Date.now() - data.get(this).startTime) / 1000;
  }
}

export default timeElapsedClass;
