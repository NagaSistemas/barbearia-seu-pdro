import { initializeApp } from "firebase/app";
import { getFirestore  } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDEtF_q1YYw8XxW8vhI_vrFDzURT509AzM",
  authDomain: "barbearia-seu-pedro-f8991.firebaseapp.com",
  projectId: "barbearia-seu-pedro-f8991",
  storageBucket: "barbearia-seu-pedro-f8991.appspot.com", // <-- Corrigido aqui!
  messagingSenderId: "432044218950",
  appId: "1:432044218950:web:4eae9b054715e8eeac4847",
  measurementId: "G-V1CS6FCYPX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
