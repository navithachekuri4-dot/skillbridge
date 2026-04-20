// src/services/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyClBC4qqcAwolSjkxsR_dPI09A9CDmuhJ8",
  authDomain: "skill-bridge-b0a0f.firebaseapp.com",
  projectId: "skill-bridge-b0a0f",

  // IMPORTANT FIX
  storageBucket: "skill-bridge-b0a0f.appspot.com",

  messagingSenderId: "243005868806",
  appId: "1:243005868806:web:c282756b9f82a282412c87"
};

const app = initializeApp(firebaseConfig);

// services we actually use
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;