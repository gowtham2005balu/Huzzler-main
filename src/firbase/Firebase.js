// // firebase.js
// import { initializeApp, getApps } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getDatabase } from "firebase/database";
// import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyCLEkkmDW0-Txk83UtWP6AIzbLvCF3HVrg",
//   authDomain: "huzzler-2d6de.firebaseapp.com",
//   projectId: "huzzler-2d6de",
//   storageBucket: "huzzler-2d6de.appspot.com",
//   messagingSenderId: "414272931377",
//   appId: "1:414272931377:web:1c48f78dc038cce47db710",
//   measurementId: "G-GGWPNVP5GX",
//   databaseURL: "https://huzzler-2d6de-default-rtdb.asia-southeast1.firebasedatabase.app"
// };

// // ❗ Prevent duplicate initialization
// const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// // Firebase.js
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const rtdb = getDatabase(app);
// export const storage = getStorage(app);







// firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCLEkkmDW0-Txk83UtWP6AIzbLvCF3HVrg",
  authDomain: "huzzler-2d6de.firebaseapp.com",
  projectId: "huzzler-2d6de",
 storageBucket: "huzzler-2d6de.firebasestorage.app" ,
  messagingSenderId: "414272931377",
  appId: "1:414272931377:web:1c48f78dc038cce47db710",
  measurementId: "G-GGWPNVP5GX",
  databaseURL: "https://huzzler-2d6de-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];


export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);




