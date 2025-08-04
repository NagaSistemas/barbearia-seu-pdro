// Import the functions you need from the SDKs you need
// Importar Firebase App e Firestore
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ADICIONE ESTA LINHA
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEtF_q1YYw8XxW8vhI_vrFDzURT509AzM",
  authDomain: "barbearia-seu-pedro-f8991.firebaseapp.com",
  projectId: "barbearia-seu-pedro-f8991",
  storageBucket: "barbearia-seu-pedro-f8991.firebasestorage.app",
  messagingSenderId: "432044218950",
  appId: "1:432044218950:web:4eae9b054715e8eeac4847",
  measurementId: "G-V1CS6FCYPX"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Instância do Firestore para usar no projeto
export const db = getFirestore(app);
export const auth = getAuth(app);  // ADICIONE ESTA LINHA

// Se precisar usar o app em outros lugares:
export { app };
