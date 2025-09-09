import { defineStore } from "pinia"
// project imports
import axios from "@/utils/axios"
import { map } from "lodash"

export const useNoteStore = defineStore("notes", {
  state: () => ({
    notes: [],
    notesContent: 1,
    noteSearch: "",
  }),

  actions: {
    // Fetch notes
    async fetchNotes() {
      try {
        const data = await axios.get("/api/data/notes/NotesData")
        this.notes = data.data
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },

    //select chat
    SelectNote(itemID) {
      this.notesContent = itemID
    },

    deleteNote(itemID) {
      const index = this.notes.findIndex((p) => p.id == itemID)
      this.notes.splice(index, 1)
    },

    updateNote(itemID, itemColor) {
      this.notes = map(this.notes, (note) => {
        if (note.id === itemID) {
          return {
            ...note,
            color: itemColor,
          }
        }
        return note
      })
    },
  },
})
