import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCh8MeTRbc6gbDPs7iwROtB0-_Q-OKh324",
  authDomain: "kakeibo-e6dc5.firebaseapp.com",
  projectId: "kakeibo-e6dc5",
  storageBucket: "kakeibo-e6dc5.firebasestorage.app",
  messagingSenderId: "578813591818",
  appId: "1:578813591818:web:49086a36971b12b4547af3",
  measurementId: "G-PD0RRE345D"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();