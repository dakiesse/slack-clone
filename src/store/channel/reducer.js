import * as actionTypes from './types'

const initialState = {
  currentChannel: null,
}

export const channelReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload.currentChannel,
      }

    default:
      return state
  }
}
