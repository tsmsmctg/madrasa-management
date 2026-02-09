
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAZvMuuJ3qn7o7xylnimU-7Ns5OBaAC5tU",
  authDomain: "tsmsmctg-fa0bd.firebaseapp.com",
  projectId: "tsmsmctg-fa0bd",
  storageBucket: "tsmsmctg-fa0bd.firebasestorage.app",
  messagingSenderId: "211422192504",
  appId: "1:211422192504:web:36c11d43b0d4d77601de8d",
  measurementId: "G-DRKJ9LMTQT"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
