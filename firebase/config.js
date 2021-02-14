import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAlmzFulYNOPzcrUImBC79Z5P0h2ATYGz8",
    authDomain: "percobaankelima-d4f4d.firebaseapp.com",
    databaseURL: "https://percobaankelima-d4f4d-default-rtdb.firebaseio.com",
    projectId: "percobaankelima-d4f4d",
    storageBucket: "percobaankelima-d4f4d.appspot.com",
    messagingSenderId: "795988188536",
    appId: "1:795988188536:web:e0f31d6cdbd54329c0fc8d",
    measurementId: "G-P4XMJGVB52"
};

const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();

export {db};