const express = require("express")
const { GetNotes, CreateNotes, UpdateNotes, DeleteNotes, AddLabel, RemoveLabel, TogglePin } = require("../controllers/NotesController")



const NoteRouter = express.Router()

NoteRouter.get("/get",GetNotes)
NoteRouter.post("/add",CreateNotes)
NoteRouter.post("/add-label/:id", AddLabel)
NoteRouter.put("/edit/:id", UpdateNotes)
NoteRouter.put("/toggle-pin/:id", TogglePin)
NoteRouter.delete("/delete/:id",DeleteNotes)
NoteRouter.delete("/remove-label/:id", RemoveLabel)

module.exports = NoteRouter