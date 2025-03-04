import React, { useEffect, useRef } from "react";
import { TbPinned, TbPinnedFilled } from "react-icons/tb";
import { MdDelete, MdLabelImportantOutline } from "react-icons/md";

const NotesSection = ({
  title,
  notes,
  onNoteClick,
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
    <div className="w-full">
      <h2 className="text-lg font-bold text-black/30 flex items-start primary-font">
        {title}
      </h2>
      <div className=" flex flex-wrap gap-3">
        {(notes && Array.isArray(notes) ? notes : []).map((note) => (
          <div key={note._id || note.createdAt} className="">
            {/* Note Card */}
            <div
              onClick={() =>
                onNoteClick(note._id, note.title, note.description)
              }
              style={{
                backgroundColor: note.color,
                opacity: note.id === "temp" ? 0.8 : 1,
              }}
              className="text-white p-4 rounded-md shadow-sm w-[250px] h-[200px] relative hover:shadow-black/70 hover:shadow-xl transition-all duration-200 group"
            >
              {/* Labels */}
              <div className="hidden group-hover:flex absolute bottom-8 left-3 gap-y-1 gap-x-2 flex-wrap w-full">
                {note?.labels?.map((label, index) => (
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

              {/* Created Time */}
              <p className="hidden group-hover:block absolute bottom-1.5 left-3 text-xs text-white/60">
                {new Date(note.createdAt).toLocaleDateString()}
              </p>

              {/* Pin Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(note._id);
                }}
                className="hidden group-hover:block absolute bg-black/45 px-2 py-1 cursor-pointer rounded-md text-white right-2 bottom-1.5 transition-all duration-200"
              >
                {note.pinned ? <TbPinnedFilled /> : <TbPinned />}
              </button>

              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note._id);
                }}
                className="hidden group-hover:block absolute bg-black/45 px-2 py-1 cursor-pointer rounded-md text-white right-12 bottom-1.5"
              >
                <MdDelete />
              </button>

              {/* Label Button */}
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

              {/* Note Title & Description */}
              <h3
                className={`font-semibold text-lg ${
                  note.id === "temp"
                    ? "text-white font-bold text-xl text-center"
                    : "text-white/70"
                }`}
              >
                {note.id === "temp" ? "New Note" : note.title}
              </h3>
              <hr className="text-white/70 mb-3" />
              <p
                className={`text-sm ${
                  note.id === "temp"
                    ? "text-white text-lg text-center font-semibold mt-10"
                    : ""
                }`}
              >
                {note.id === "temp" ? "Drop to add..." : note.description}
              </p>

              {/* Label Input Field */}
              <div onClick={(e) => e.stopPropagation()}>
                {labelInputVisible === note._id && (
                  <div className="absolute -bottom-12 -right-0 w-[170px] shadow-md bg-black/50 p-3 text-sm rounded-xl z-10">
                    <div className="flex items-center justify-between">
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
                        className="text-white/80 rounded-full text-lg bg-white/20 w-5 h-5 p-2 flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* End of Note Card */}
          </div>
        ))}
      </div>
    </div>
  );
};
export default NotesSection;
