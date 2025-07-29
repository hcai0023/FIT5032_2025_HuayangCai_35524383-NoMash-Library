// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfm1KB-CeqVKo00rr6ckTiJIF_vaT9I60",
  authDomain: "week7-huayang-cai.firebaseapp.com",
  projectId: "week7-huayang-cai",
  storageBucket: "week7-huayang-cai.firebasestorage.app",
  messagingSenderId: "478100470138",
  appId: "1:478100470138:web:5723a34b9d12267535fec3"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore()
export default db