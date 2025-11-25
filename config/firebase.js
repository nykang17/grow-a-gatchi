import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "REMOVED",
  authDomain: "REMOVED",
  databaseURL: "REMOVED",
  projectId: "REMOVED",
  storageBucket: "REMOVED.firebasestorage.app",
  messagingSenderId: "REMOVED",
  appId: "1:REMOVED:web:041620661defe78f38e535",
  measurementId: "REMOVED"
};


const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);