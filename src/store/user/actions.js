import * as actionTypes from './types'

export const setUser = (user) => ({
  type: actionTypes.SET_USER,
  payload: {
    currentUser: user,
    isLoading: false,
  }
})

export const clearUser = () => ({
  type: actionTypes.CLEAR_USER,
})
