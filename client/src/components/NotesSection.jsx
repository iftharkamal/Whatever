import React from 'react'
import NoteCard from './NoteCard'

const NotesSection = ({title,
    notes,
    onNoteClick,
    onTogglePin,
    onDelete,
    labelInputVisible,
    setLabelInputVisible,
    newLabel,
    setNewLabel,
    handleAddLabel,
    handleRemoveLabel,}) => {
  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-black/30 flex items-start primary-font">
        {title}
      </h2>
      <div className="flex flex-wrap gap-3 ">
        {notes.map((note) => (
          <NoteCard
            key={note._id || note.createdAt}
            note={note}
            onClick={onNoteClick}
            onTogglePin={onTogglePin}
            onDelete={onDelete}
            labelInputVisible={labelInputVisible}
            setLabelInputVisible={setLabelInputVisible}
            newLabel={newLabel}
            setNewLabel={setNewLabel}
            handleAddLabel={handleAddLabel}
            handleRemoveLabel={handleRemoveLabel}
          />
        ))}
      </div>
    </div>
  )
}

export default NotesSection
