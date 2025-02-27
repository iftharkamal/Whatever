const Note = require("../models/NotesModels");


const GetNotes = async (req,res) =>{
    try {
        const notes = await Note.find().sort({createdAt: -1})
        return res.json(notes)
    } catch (error) {
        return res.json({message:"getNotes Error"})
    }
}

const CreateNotes = async (req,res) =>{
    try {
        const {title,description,color,pinned,label} = req.body;
        const note = new Note({title,description,color,pinned,label})
        await note.save();
        return res.json(note)
    } catch (error) {
        return res.json({message:"Error Creating Notes"})
    }
}

const UpdateNotes = async (req,res) =>{
    try {
        const {title,description,color,pinned,labels} = req.body;
        const note = await Note.findByIdAndUpdate(req.params.id,{title,description,pinned,color,labels},{new:true})
        if(!note) return res.json({message:"Note not found"})
            return res.json(note)
    } catch (error) {
        return res.json({message:"Error updating Note"})
    }
}


const DeleteNotes = async (req,res) =>{
    try {
        const note = await Note.findByIdAndDelete(req.params.id)
        if(!note) return res.json({message:"Note not found"})
            return res.json({message:"Note deleted successfully"})
    } catch (error) {
        return res.json({message:"error message deleting"})
    }
}

const AddLabel = async (req,res) =>{
    try {
        const {id} = req.params
        const {label} = req.body
        const note = await Note.findById(id)
        if(note){
            note.labels.push(label)
            await note.save()
            return res.json(note)
        }else{
            return res.json({message:"Note not found"})
        }
    } catch (error) {
        return res.json({message:"Error to toggle pin"})
    }
}

const RemoveLabel = async (req,res) =>{
    const {id} = req.params
    const {label} = req.body
    try {
        const note = await Note.findById(id)
        if(note){
            note.labels = note.labels.filter((existingLabel) => existingLabel !== label)
            await note.save()
            return res.json(note)
        }  
    } catch (error) {
        return res.json({message:"label Removing error"})
    }
}

const TogglePin = async (req,res) =>{
   const {id} = req.params
   try {
     const note = await Note.findById(id)
     note.pinned = !note.pinned
     await note.save()
     return res.json(note)
   } catch (error) {
    return res.json({message:"Toggle pin error"})
   }
}



module.exports = {GetNotes,CreateNotes,UpdateNotes,DeleteNotes,AddLabel,RemoveLabel,TogglePin}