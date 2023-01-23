// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDj_D21eAPRLSUbnNnywozStY9PbzRowjc",
  authDomain: "realtor-react-81994.firebaseapp.com",
  projectId: "realtor-react-81994",
  storageBucket: "realtor-react-81994.appspot.com",
  messagingSenderId: "877871773659",
  appId: "1:877871773659:web:b2b0b95db5f9195c2119fe",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
