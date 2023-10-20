// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "nature-estate.firebaseapp.com",
  projectId: "nature-estate",
  storageBucket: "nature-estate.appspot.com",
  messagingSenderId: "854586728121",
  appId: "1:854586728121:web:fd6dc2953ac677c2ccc568"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);