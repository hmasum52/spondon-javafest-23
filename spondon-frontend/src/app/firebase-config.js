// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "GOOGLE_API_KEY",
  authDomain: "spondon-23.firebaseapp.com",
  projectId: "spondon-23",
  storageBucket: "spondon-23.appspot.com",
  messagingSenderId: "857948751232",
  appId: "1:857948751232:web:83878e45cffbc0ed736d65",
  measurementId: "G-BHT6BK9VFS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);

