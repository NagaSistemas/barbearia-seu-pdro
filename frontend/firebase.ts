import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB1flUvvSd8K3vDXWLzBHsdDTR_3FZw7Wk",
  authDomain: "barbearia---seu-pedro.firebaseapp.com",
  projectId: "barbearia---seu-pedro",
  storageBucket: "barbearia---seu-pedro.firebasestorage.app",
  messagingSenderId: "604522173164",
  appId: "1:604522173164:web:bbf49edf8d08956e700bc9",
  measurementId: "G-29T6S1C48X"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
