import { initializeApp } from "firebase/app"
import { getFirestore, collection } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBeuuLMpuzIg1bWFjPquHX9SsxhkcY4KbI",
    authDomain: "react-notes-app-3d1c6.firebaseapp.com",
    projectId: "react-notes-app-3d1c6",
    storageBucket: "react-notes-app-3d1c6.appspot.com",
    messagingSenderId: "275748567536",
    appId: "1:275748567536:web:59d68f7cdb6514895c0535"
}

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")
