import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "APIKEY",
  authDomain: "AUTHDOMAIN",
  databaseURL: "DATABASEURL",
  projectId: "PROJECTID",
  storageBucket: "BUCKET",
  messagingSenderId: "SENDERID",
  appId: "APPID",
  measurementId: "MEASSUREMENTID"
};


const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
