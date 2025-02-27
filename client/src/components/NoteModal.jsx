import React from 'react'

const NoteModal = ({
    isModalOpen,
    noteTitle,
    noteDescription,
    setNoteTitle,
    setNoteDescription,
    saveNote,
    closeModal,
    editingId,
  
}) => {
    if(!isModalOpen) return null
  return (
    <div className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 bg-black/50 p-5 rounded-lg w-[600px] text-center shadow-md">
      <h2 className="font-semibold text-2xl text-white/90 mb-5">
        {editingId ? "Edit Note" : "Create a Note"}
      </h2>
      <input
        placeholder="Title..."
        value={noteTitle}
        onChange={(e) => setNoteTitle(e.target.value)}
        className="w-full rounded-md mt-2 outline-none border border-[#ccc] bg-white/50 p-4"
      />
      <textarea
        placeholder="Description..."
        rows="7"
        value={noteDescription}
        onChange={(e) => setNoteDescription(e.target.value)}
        className="w-full rounded-md mt-2 outline-none border border-[#ccc] bg-white/50 p-4"
      />
      <div className="mt-2">
        <button
          onClick={saveNote}
          className="mr-2 px-5 py-3 bg-[#007BFF] text-white border-none rounded-md cursor-pointer"
        >
          {editingId ? "Update" : "Save"}
        </button>
        <button
          onClick={closeModal}
          className="px-5 py-3 bg-[#ccc] text-[#333] border-none rounded-md cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default NoteModal
