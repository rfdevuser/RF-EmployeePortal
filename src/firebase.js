// firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZPdFrSUkPpQWQikvZ9HoINwQ26ddbgxU",
  authDomain: "employeedoc-78a70.firebaseapp.com",
  projectId: "employeedoc-78a70",
  storageBucket: "employeedoc-78a70.appspot.com",
  messagingSenderId: "65450646993",
  appId: "1:65450646993:web:e36bf81ec2a3aa901654f0",
  measurementId: "G-1XWM03WWXP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

export { storage };
