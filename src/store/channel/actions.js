import * as actionTypes from './types'

export const setCurrentChannel = (channel) => ({
  type: actionTypes.SET_CURRENT_CHANNEL,
  payload: {
    currentChannel: channel,
  }
})
