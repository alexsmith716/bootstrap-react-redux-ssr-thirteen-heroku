// Actions
// -------------------

const initialState = {
  userAgent: null,
  isBot: null,
};

// Reducer
// -------------------
export default function reducer(state = initialState, action) {

  switch (action.type) {

    default:
      console.log('>>>>>>>>>>>>>>>> device > reducer > SWITCH > action.type > default > state: ', state);
      return state;
  }
}

// Actions (action creators)
// -------------------
