// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBEX0eVPh3eVWqDctYsL_gQqCozy4nq9oA",
  authDomain: "k-flex-dashboard.firebaseapp.com",
  projectId: "k-flex-dashboard",
  storageBucket: "k-flex-dashboard.appspot.com",
  messagingSenderId: "497155262231",
  appId: "1:497155262231:web:f2ed5bebb2bb43915fd952",
  measurementId: "G-CTWY669XLK",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
