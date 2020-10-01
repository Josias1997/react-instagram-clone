import firebase from 'firebase';


const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyC6rkUKTr65Wka9VMmy3oD98iT9CHH_hHY",
    authDomain: "react-instagram-clone-7ca68.firebaseapp.com",
    databaseURL: "https://react-instagram-clone-7ca68.firebaseio.com",
    projectId: "react-instagram-clone-7ca68",
    storageBucket: "react-instagram-clone-7ca68.appspot.com",
    messagingSenderId: "131165067041",
    appId: "1:131165067041:web:1b0f826b86a881c6dc5060",
    measurementId: "G-Z7061F8VPL"
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage()

export {db, auth, storage};