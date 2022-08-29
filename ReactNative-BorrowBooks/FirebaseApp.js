// 1. import the firebase project keys
import firebaseConfig from "./config/firebase-keys"

// other imports from firebase libraries
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


// 2. instantiate the firebase app 
// 3. the "export" keyword enables the firebaseApp variable to be accessible outside this file
export const firebaseApp = initializeApp(firebaseConfig);

// 4. Add other firebase services here
export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)