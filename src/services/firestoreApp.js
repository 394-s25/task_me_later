// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKa1TSzuNER1HuZ6k9FJGh0loeBdwYeic",
  authDomain: "task-me-later.firebaseapp.com",
  projectId: "task-me-later",
  storageBucket: "task-me-later.firebasestorage.app",
  messagingSenderId: "340212522916",
  appId: "1:340212522916:web:60764ab9ce58d1f7dfab31",
  measurementId: "G-Q0HR9MZ34Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);