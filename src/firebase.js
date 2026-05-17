// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAo7joE-sst5C9HmV3wJ94iA9gseBXMLbI",
  authDomain: "my-shop-ed005.firebaseapp.com",
  projectId: "my-shop-ed005",
  storageBucket: "my-shop-ed005.firebasestorage.app",
  messagingSenderId: "258669935428",
  appId: "1:258669935428:web:50b502ea0144096c963511",
  measurementId: "G-S32JEH7JGY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
