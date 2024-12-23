// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAZqHTg5QDJlTEAP3bVdQOM9oy-8zfLQII",
    authDomain: "game-based-learning-3a957.firebaseapp.com",
    projectId: "game-based-learning-3a957",
    storageBucket: "game-based-learning-3a957.appspot.com",
    messagingSenderId: "226620441583",
    appId: "1:226620441583:web:6400b6d60dfbf72b212c1a",
    measurementId: "G-2142X6GY7M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, db, analytics };