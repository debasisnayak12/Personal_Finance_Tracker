// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5K9u0WMOMx1_ck6mNGKWDvhkxtaScYGs",
  authDomain: "financly-50f1d.firebaseapp.com",
  projectId: "financly-50f1d",
  storageBucket: "financly-50f1d.appspot.com",
  messagingSenderId: "743945101598",
  appId: "1:743945101598:web:436c521d9dfcdd6207290f",
  measurementId: "G-PRVX430EBE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {db, auth, provider, doc, setDoc};