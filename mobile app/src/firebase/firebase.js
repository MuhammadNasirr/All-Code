import firebase from 'firebase';
import "@firebase/firestore";

firebase.initializeApp({
    apiKey: "AIzaSyB_TcOOGo_3T4KYKOUpL3oU686sTNuyhqM",
    authDomain: "gimonii-admin-panel.firebaseapp.com",
    databaseURL: "https://gimonii-admin-panel.firebaseio.com",
    projectId: "gimonii-admin-panel",
    storageBucket: "gimonii-admin-panel.appspot.com",
    messagingSenderId: "1035343764956"

});

export const fireStore = firebase.firestore();
export const fireBase = firebase;
export const auth = firebase.auth();
