import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAE0lXJnOVfYe8tiD2njbKPBETHCKcC-pI",
    authDomain: "needmap-4bff6.firebaseapp.com",
    projectId: "needmap-4bff6",
    storageBucket: "needmap-4bff6.firebasestorage.app",
    messagingSenderId: "344516755355",
    appId: "1:344516755355:web:918588739316a143a6eb3e",
    measurementId: "G-6E6RJ0RQYL"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);