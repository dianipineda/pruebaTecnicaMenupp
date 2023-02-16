import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//import firebase from "firebase/app";
//import "firebase/auth";

//inizialize and get db firebase
const firebaseConfig = {
  apiKey: "AIzaSyDdCk0t1pseeAMxXviyUH0-Fydb37_-ItA",
  authDomain: "apptest-a02f2.firebaseapp.com",
  projectId: "apptest-a02f2",
  storageBucket: "apptest-a02f2.appspot.com",
  messagingSenderId: "249478801494",
  appId: "1:249478801494:web:625473aa13db438e2e73f7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//const auth = firebase.auth();
//const timestamp = firebase.firestore.FieldValue.serverTimestamp;
//export
//export { auth, timestamp };
export default db;
