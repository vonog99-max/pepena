import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBO7QkS9FS4edt2tMhsNJJKjDhBhvdE7L8",
  authDomain: "prpkect.firebaseapp.com",
  projectId: "prpkect",
  storageBucket: "prpkect.firebasestorage.app",
  messagingSenderId: "894380261436",
  appId: "1:894380261436:web:919a53db3347e2127bc339",
  measurementId: "G-N9ZQ0HWMC7"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
