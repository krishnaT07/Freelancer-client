import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  "projectId": "freelance-marketplace-a0f6b",
  "appId": "1:286902035447:web:8d7e7ff002f25fd099c4f2",
  "storageBucket": "freelance-marketplace-a0f6b.firebasestorage.app",
  "apiKey": "AIzaSyA-NOSAYDBkpwi4bwM50I6VgPj5hiP8bSQ",
  "authDomain": "freelance-marketplace-a0f6b.firebaseapp.com",
  "messagingSenderId": "286902035447"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, storage };