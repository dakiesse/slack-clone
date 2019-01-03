import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

const config = {
  apiKey: 'AIzaSyCbxtPkqY0rkdTMf61h1QuLNFkx-PuHBRw',
  authDomain: 'react-slack-clone-1cd00.firebaseapp.com',
  databaseURL: 'https://react-slack-clone-1cd00.firebaseio.com',
  projectId: 'react-slack-clone-1cd00',
  storageBucket: 'react-slack-clone-1cd00.appspot.com',
  messagingSenderId: '776605896204'
}

firebase.initializeApp(config)

export default firebase
