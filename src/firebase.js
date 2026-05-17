import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAo7joE-sst5C9HmV3wJ94iA9gseBXMLbI",
  authDomain: "my-shop-ed005.firebaseapp.com",
  projectId: "my-shop-ed005",
  storageBucket: "my-shop-ed005.firebasestorage.app",
  messagingSenderId: "258669935428",
  appId: "1:258669935428:web:50b502ea0144096c963511",
  measurementId: "G-S32JEH7JGY",
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

export const db = getFirestore(app);
