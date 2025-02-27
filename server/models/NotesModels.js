const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    color: { type: String },
    pinned: { type: Boolean, default: false },
    labels: { type: [String] },
  },
  { timestamps: true }
);


const Note = mongoose.model("Note", NoteSchema) 

module.exports = Note