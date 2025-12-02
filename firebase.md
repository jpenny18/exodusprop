// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADnymwQTBfthA4gONxBAPE_WNPB251XMI",
  authDomain: "exodusprop-69fe6.firebaseapp.com",
  projectId: "exodusprop-69fe6",
  storageBucket: "exodusprop-69fe6.firebasestorage.app",
  messagingSenderId: "25499732832",
  appId: "1:25499732832:web:9d0ac4010f3180dc6d2c05",
  measurementId: "G-GS88HV3Z80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);