import React from 'react'
import { TbPinned, TbPinnedFilled } from "react-icons/tb";
import { MdDelete, MdLabelImportantOutline } from "react-icons/md";



const NoteCard = ({
    note,
    onClick,
    onTogglePin,
    onDelete,
    labelInputVisible,
    setLabelInputVisible,
    newLabel,
    setNewLabel,
    handleAddLabel,
    handleRemoveLabel,
}) => {
  return (
    <div
      onClick={() => onClick(note._id, note.title, note.description)}
      style={{ backgroundColor: note.color }}
      className="text-white p-4 rounded-md shadow-sm w-[250px] h-[200px] relative hover:shadow-black/70 hover:shadow-xl transition-all duration-200 group"
    >
      {/* labels */}
      <div className="hidden group-hover:flex absolute bottom-8 left-3 gap-y-1 gap-x-2 flex-wrap w-full">
        {note.labels.map((label, index) => (
          <div
            key={index}
            className="bg-white/15 flex items-center gap-2 text-xs py-1 px-2 rounded-4xl"
          >
            <span>{label}</span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveLabel(note._id, label);
              }}
              className="font-semibold w-4 h-4 rounded-full bg-white/20 flex items-center justify-center cursor-pointer"
            >
              x
            </span>
          </div>
        ))}
      </div>

      {/* Created time */}
      <p className="hidden group-hover:block absolute bottom-1.5 left-3 text-xs text-white/60">
        {new Date(note.createdAt).toLocaleDateString()}
      </p>
      {/* Pin button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTogglePin(note._id);
        }}
        className="hidden group-hover:block absolute bg-black/45 px-2 py-1 cursor-pointer rounded-md text-white right-2 bottom-1.5 transition-all duration-200"
      >
        {note.pinned ? <TbPinnedFilled /> : <TbPinned />}
      </button>
      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(note._id);
        }}
        className="hidden group-hover:block absolute bg-black/45 px-2 py-1 cursor-pointer rounded-md text-white right-12 bottom-1.5"
      >
        <MdDelete />
      </button>
      {/* Label button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setLabelInputVisible(
            labelInputVisible === note._id ? false : note._id
          );
        }}
        className="hidden group-hover:block absolute bg-black/45 px-2 py-1 cursor-pointer rounded-md text-white right-22 bottom-1.5"
      >
        <MdLabelImportantOutline />
      </button>

      <h3 className="font-semibold text-lg text-white/70">{note.title}</h3>
      <hr className="text-white/70 mb-3" />
      <p className="text-sm">{note.description}</p>
      {/* Label input field */}
      <div onClick={(e) => e.stopPropagation()}>
        {labelInputVisible === note._id && (
          <div className="absolute -bottom-16 -right-1 shadow-md bg-black/50 p-5 text-sm rounded-3xl z-10">
            <div className="w-[170px] flex px-2 py-1 border border-gray-600/60 rounded-md">
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Add Label"
                className="outline-none w-full"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddLabel(note._id);
                }}
                className="text-white/80 rounded-full text-xl bg-white/20 w-5 h-5 flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NoteCard
