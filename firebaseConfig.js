// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAZeJ6bPTj2t26Gz9S1cvxPDTiKbjt95s4",
  authDomain: "finance-tracker-1fb05.firebaseapp.com",
  projectId: "finance-tracker-1fb05",
  storageBucket: "finance-tracker-1fb05.appspot.com",
  messagingSenderId: "437853128669",
  appId: "1:437853128669:web:9dea17bc7d4b157cdad834",
  measurementId: "G-Y80Q4GT8LC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
