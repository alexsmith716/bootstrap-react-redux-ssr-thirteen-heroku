
// es6 module > closures
// emulate private methods with closures
// module pattern
// private methods: manage global namespace by controlling exposure of API methods

// languages such as Java provide the ability to declare methods private, (they can only be called by other methods in the same class)
// JS does not provide a way of doing this, but it is possible to emulate private methods using closures
// private methods:
//    * restricting access to code
//    * manage global namespace (keep non-essential methods from cluttering an API)

// create an anonymous function and assign to var 'timeElapsedModule'
const timeElapsedModule = () => {

  // single lexical environment
  // private functions and variables
  let startedTime = 0;
  let elapsedTime = 0;

  function timeSet() {
    startedTime = Date.now();
  }

  function timeElapsed() {
    return elapsedTime = (Date.now() - startedTime) / 1000;
  }

  // ------------------------------------------------------

  // single lexical environment shared by below public functions
  // lexical environment: consists of any local variables that were in-scope at the time the closure was created
  // these functions have access to above private items through JS's lexical scoping
  // anonymous wrapper
  return {

    setStartTime: () => {
      timeSet();
    },

    getStartTime: () => {
      return startedTime;
    },

    getSecondsElapsed: () => {
      return timeElapsed();
    },

  }
};

export default timeElapsedModule;
