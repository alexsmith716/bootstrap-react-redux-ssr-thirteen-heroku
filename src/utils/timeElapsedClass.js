
// accessor properties: getters and setters

class TimeElapsedClass {

  constructor() {}
  // constructor(startTime) {
  //   this._startTime = startTime;
  // }

  set startTime(startTime) {
    this._startTime = startTime;
  }

  get startTime() {
    return this._startTime;
  }

  // -----------------------------

  get secondsElapsed() {
    return (Date.now() - this._startTime) / 1000;
  }

  secondsElapsedX(elapsed) {
    return (elapsed - this._startTime) / 1000;
  }

}

export default new TimeElapsedClass();
