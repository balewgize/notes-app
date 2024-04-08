import React, { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { onSnapshot, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { notesCollection, db } from "./firebase"


export default function App() {
    const [notes, setNotes] = useState([])
    const [currentNoteId, setCurrentNoteId] = useState("")
    const [tempNoteText, setTempNoteText] = useState("")

    const currentNote = notes.find(note => note.id === currentNoteId) || notes[0]

    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)

    useEffect(() => {
        // onSnapshot is used to listen to changes in the notes collection
        const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
            const notes = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setNotes(notes)
        })
        // to remove the listener when component unmounts
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])

    useEffect(() => {
        if (currentNote) {
            setTempNoteText(currentNote.body)
        }
    }, [currentNote])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (tempNoteText !== currentNote?.body) {
                updateNote(tempNoteText)
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [tempNoteText])

    const createNewNote = async () => {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        }
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }

    const updateNote = async (text) => {
        if (!currentNoteId) {
            console.error("currentNoteId is undefined or invalid.")
            return
        }
        const docRef = doc(db, "notes", currentNoteId)
        await updateDoc(docRef, { body: text, updatedAt: Date.now() })
    }

    const deleteNote = async (noteId) => {
        const docRef = doc(db, "notes", noteId)
        await deleteDoc(docRef)
    }


    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={sortedNotes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        <Editor
                            tempNoteText={tempNoteText}
                            setTempNoteText={setTempNoteText}
                        />
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                        </button>
                    </div>
            }
        </main>
    )
}
