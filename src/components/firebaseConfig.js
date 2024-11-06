// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyCS-dkq7iUGKx4P1YTmFdnAIjbv-23Tw9w",
  authDomain: "roomie-6ec35.firebaseapp.com",
  projectId: "roomie-6ec35",
  storageBucket: "roomie-6ec35.appspot.com",
  messagingSenderId: "851414210921",
  appId: "1:851414210921:web:4cee7a358b72970bb8c5f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);
const firestore = getFirestore(app);
export default app;