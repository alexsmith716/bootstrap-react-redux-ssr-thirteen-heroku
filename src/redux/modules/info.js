// Actions
// -------------------
const LOAD = 'redux-example/info/LOAD';
const LOAD_SUCCESS = 'redux-example/info/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/info/LOAD_FAIL';

import { mockAPI, getRandomInt, getSomeAsyncData } from '../../utils/mockAPI';

const initialState = {
  loaded: false,
  data: null,
};

// Reducer
// -------------------
export default function reducer(state = initialState, action = {}) {

  switch (action.type) {

    case LOAD:
      console.log('>>>>>>>>>>>>>>>> info > redux > SWITCH > action.type > LOAD > state: ', state);
      return {
        ...state,
        loading: true,
      };

    case LOAD_SUCCESS:
      console.log('>>>>>>>>>>>>>>>> info > redux > SWITCH > action.type > LOAD_SUCCESS > action.result: ', action);
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result,
      };

    case LOAD_FAIL:
      console.log('>>>>>>>>>>>>>>>> info > redux > SWITCH > action.type > LOAD_FAIL > action.error: ', action);
      return {
        ...state,
        loading: false,
        loaded: false,
        // error: action.error,
        error: true,
        errorResponse: {message: action.error.message, documentation_url:''},
      };

    default:
      return state;
  }
}

// Actions (action creators)
// -------------------
export function isLoaded(globalState) {
  console.log('>>>>>>>>>>>>>>>> info > redux > Action > isLoaded() ??: ', globalState.info && globalState.info.loaded);
  return globalState.info && globalState.info.loaded;
}

// export function load() {
//   console.log('>>>>>>>>>>>>>>>> info > redux > Action > load() <<<<<<<<<<<<<<<<<<');
//   return {
//     types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
//     promise: () => mockAPI(() => getRandomInt(), 1000 )
//   };
// };

export function load() {
  console.log('>>>>>>>>>>>>>>>> info > redux > Action > load() <<<<<<<<<<<<<<<<<<');
  let location = 'https://api.github.com/feeds';
  // let location = 'https://www.metaweather.com/api/location/2459115/';
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    // promise: () => mockAPI(() => getRandomInt())
    // promise: () => mockAPI(() => getSomeAsyncData(location))
    promise: async () => {
      try {
        const response = await getSomeAsyncData(location);
        console.log('>>>>>>>>>>>>>>>> ########## info ########## > redux > Action > load() > response: ', response);
        return response;
      } catch (error) {
        return Promise.reject(error);
        throw error;
      }
    }
  };
};

// export function load(value) {
//   console.log('>>>>>>>>>>>>>>>> info > redux > Action > load() <<<<<<<<<<<<<<<<<<');
//   let w = 'https://www.metaweather.com/api/location/2459115/';
//   return {
//     types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
//     promise: ({ client }) => client.get(w)
//   };
// };
