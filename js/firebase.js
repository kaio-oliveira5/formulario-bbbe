// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBJX-kDr4vpAdDnCNJtSIpCp3zs1Fp3OnY",
    authDomain: "bbbe-formulario.firebaseapp.com",
    projectId: "bbbe-formulario",
    storageBucket: "bbbe-formulario.appspot.com",
    messagingSenderId: "622643566680",
    appId: "1:622643566680:web:643d0e7cd6979a5881922d"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);