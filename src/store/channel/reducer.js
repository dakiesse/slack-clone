import * as actionTypes from './types'

const initialState = {
  currentChannel: null,
  isPrivateChannel: false,
}

export const channelReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload.currentChannel,
      }

    case actionTypes.SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivateChannel: action.payload.isPrivateChannel,
      }

    default:
      return state
  }
}
