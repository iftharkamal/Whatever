import React, { useEffect, useState } from "react";
import API from "../services/api";
import { TbPinned, TbPinnedFilled } from "react-icons/tb";
import { MdDelete, MdLabelImportantOutline } from "react-icons/md";
import SearchBar from "./SearchBar";



const MainContainer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedColor, setDraggedColor] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDescription, setNoteDescription] = useState("");
  // const [noteText, setNoteText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [pinnedNotes, setPinnedNotes] = useState([]);
  const [otherNotes, setOtherNotes] = useState([]);
  const [newLabel, setNewLabel] = useState("");
  const [labelInputVisible, setLabelInputVisible] = useState(false);

  const colors = ["#319b79", "#26735b", "#1a4c3c", "#0d261e", "#000000"];

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await API.get("/api/notes/get");
        console.log("fetched data :", res.data);
        if (Array.isArray(res.data)) {
          // If the response is an array, split it by pinned status.
          setPinnedNotes(res.data.filter((note) => note.pinned).reverse());
          setOtherNotes(res.data.filter((note) => !note.pinned).reverse());
        } else if (res.data && typeof res.data === "object") {
          // If the response is an object, assume it has pinnedNotes and otherNotes properties.
          setPinnedNotes(res.data.pinnedNotes || []);
          setOtherNotes(res.data.otherNotes || []);
        }
      } catch (error) {
        console.error("Failed to fetch notes:", error);
        setPinnedNotes([]);
        setOtherNotes([]);
      }
    };
    fetchNotes();
  }, []);

  const handleDragStart = (color) => {
    setDraggedColor(color); // Save the dragged sphere's color
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    setEditingId(null);
    setNoteTitle("");
    setNoteDescription("");
    setIsModalOpen(true); // Open modal
  };

  // Save & update note and close modal
  const saveNote = async () => {
    if (noteTitle.trim() && noteDescription.trim()) {
      try {
        if (editingId) {
          // update existing note
          const updatedNote = await API.put(`/api/notes/edit/${editingId}`, {
            title: noteTitle,
            description: noteDescription,
          });
          // setNotes((prevNotes) => prevNotes.map((note,i)=> (i === editingIndex? updatedNote.data : note)))
          setPinnedNotes((prev) =>
            prev.map((note) =>
              note._id === editingId ? updatedNote.data : note
            )
          );
          setOtherNotes((prev) =>
            prev.map((note) =>
              note._id === editingId ? updatedNote.data : note
            )
          );
        } else {
          // create a new note
          const newNote = await API.post("/api/notes/add", {
            title: noteTitle,
            description: noteDescription,
            createdAt: new Date().toISOString(),
            color: draggedColor,
          });
          setOtherNotes((prev) => [...prev, newNote.data]);
        }

        setNoteTitle("");
        setNoteDescription("");
        setEditingId(null);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Failed to save note:", error);
      }
    }
  };

  // Open modal for editing an existing note
  const handleNoteClick = (id, title, description) => {
    setEditingId(id); // Set the index of the note being edited
    // setNoteText(isPinned?  pinnedNotes[index].text : otherNotes[index].text); // Pre-fill the modal with the note text
    setNoteTitle(title);
    setNoteDescription(description);
    setIsModalOpen(true); // Open modal
  };

  // toggle pin
  const togglePin = async (id) => {
    try {
      const updatedNote = await API.put(`/api/notes/toggle-pin/${id}`);
      setPinnedNotes((prev) =>
        updatedNote.data.pinned
          ? [updatedNote.data, ...prev]
          : prev.filter((note) => note._id !== id)
      );
      setOtherNotes((prev) =>
        updatedNote.data.pinned
          ? prev.filter((note) => note._id !== id)
          : [updatedNote.data, ...prev]
      );
    } catch (error) {
      console.error("Failed to toggle pin:", error);
    }
  };

  // delete notes
  const deleteNotes = async (id) => {
    try {
      await API.delete(`/api/notes/delete/${id}`);
      setPinnedNotes((prev) => prev.filter((note) => note._id !== id));
      setOtherNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Failed to delete notes:", error);
    }
  };

  // Add label
  const handleAddLabel = async (id) => {
    if (newLabel.trim()) {
      try {
        const updatedNote = await API.post(`api/notes/add-label/${id}`, {
          label: newLabel,
        });
        setPinnedNotes((prev) =>
          prev.map((note) => (note._id === id ? updatedNote.data : note))
        );
        setOtherNotes((prev) =>
          prev.map((note) => (note._id === id ? updatedNote.data : note))
        );
        setNewLabel("");
        setLabelInputVisible(false)
      } catch (error) {
        console.error("Failed to Add label", error);
      }
    }
  };

  // remove Label
    const handleRemoveLabel = async (id,labelToRemove) => {
      try {
        const updatedNote = await API.delete(`api/notes/remove-label/${id}`,{data:{label: labelToRemove}});
        setPinnedNotes((prev) =>
          prev.map((note) => (note._id === id ? {...note, labels:note.labels.filter(label => label !== labelToRemove)} : note))
        );
        setOtherNotes((prev) =>
          prev.map((note) => (note._id === id ? {...note, labels:note.labels.filter(label => label !== labelToRemove)}  : note))
        );
      } catch (error) {
        console.error("Failed to remove error", error);
      }
    };

  return (
    <div className=" w-[100vw] h-[100vh] bg-[#caeec2]">
      <div className="flex gap-10 w-full h-full">
        {/* Draggable Color Spheres */}
        <div className="flex flex-col gap-4 px-10  h-full w-[3%] items-center justify-center border-r border-r-gray-300">
          {colors.map((color) => (
            <div
              key={color}
              draggable
              onDragStart={() => handleDragStart(color)}
              className="w-8 h-8 rounded-full  cursor-grab shadow-sm"
              style={{
                backgroundColor: color,
              }}
            ></div>
          ))}
        </div>

        {/* Drop Area */}
        <div className="w-[98%] flex flex-col items-center justify-center">
          {/* SearchBar */}
          <div className="mt-6 mb-10 w-full flex justify-center items-center">
            <SearchBar />
          </div>
          {/* Notes Display */}
          <div
            className="flex flex-wrap gap-3 w-full h-full py-7"
            onDragOver={(e) => e.preventDefault()} // Allow drop
            onDrop={handleDrop}
          >
            {/* pinned section */}
            {pinnedNotes.length > 0 && (
              <div className="w-full">
                <h2 className="text-lg font-bold text-black/30 flex items-start">
                  PINNED
                </h2>
                <div className="flex flex-wrap gap-3 ">
                  {pinnedNotes.map((notes) => (
                    <div
                      key={notes._id || notes.createdAt}
                      onClick={() =>
                        handleNoteClick(
                          notes._id,
                          notes.title,
                          notes.description
                        )
                      }
                      style={{ backgroundColor: notes.color }}
                      className="text-white p-4 rounded-md  shadow-sm w-[250px] h-[200px] relative hover:shadow-black/70 hover:shadow-xl transition-all duration-200 group"
                    >
                      {/* labels */}
                      <div className=" hidden group-hover:flex absolute bottom-8 left-3 gap-y-1 gap-x-2 flex-wrap w-full">
                        {notes.labels.map((label, index) => (
                          <div
                            key={index}
                            className=" bg-white/15 flex items-center gap-2 text-xs py-1 px-2 rounded-4xl"
                          >
                            <span>{label}</span>
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveLabel(notes._id,label);
                              }}
                              className="font-semibold w-4 h-4 rounded-full bg-white/20 flex items-center justify-center cursor-pointer"
                            >
                              x
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Created time & date */}
                      <p className="hidden group-hover:block absolute bottom-1.5 left-3 text-xs text-white/60">
                        {new Date(notes.createdAt).toLocaleDateString()}
                      </p>
                      {/* unpinned button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(notes._id);
                        }}
                        className="hidden group-hover:block absolute bg-black/45 px-2 py-1 cursor-pointer rounded-md text-white right-2 bottom-1.5 transition-all duration-200"
                      >
                        <TbPinnedFilled />
                      </button>
                      {/* delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotes(notes._id);
                        }}
                        className="hidden group-hover:block absolute bg-black/45 px-2 py-1 cursor-pointer rounded-md text-white right-12 bottom-1.5"
                      >
                        <MdDelete />
                      </button>
                      {/* label button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLabelInputVisible(
                            labelInputVisible === notes._id ? false : notes._id
                          );
                        }}
                        className="hidden group-hover:block absolute bg-black/45 px-2 py-1 cursor-pointer rounded-md text-white right-22 bottom-1.5"
                      >
                        <MdLabelImportantOutline />
                      </button>

                      {/* notes card */}
                      <h3 className="font-semibold text-lg text-white/70">
                        {notes.title}
                      </h3>
                      <hr className="text-white/70 mb-3" />
                      <p className="text-sm">{notes.description}</p>
                      {/* label input field */}
                      <div onClick={(e) => e.stopPropagation()}>
                        {labelInputVisible === notes._id && (
                          <div className="absolute -bottom-16 -right-1 shadow-md bg-black/50 p-5 text-sm rounded-3xl z-10">
                            <div className="w-[170px] flex px-2 py-1 border border-gray-600/60 rounded-md">
                              <input
                                type="text"
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                                // autoFocus
                                // onBlur={() => setLabelInputVisible(false)} 
                                placeholder="Add Label"
                                className=" outline-none w-full"
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddLabel(notes._id);
                                }}
                                className=" text-white/80 rounded-full text-xl bg-white/20 w-5 h-5 flex items-center justify-center cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* others section */}
            <div className="w-full">
              <h2 className="text-lg font-bold text-black/30 flex items-start">
                OTHERS
              </h2>
              <div className=" flex flex-wrap gap-3 ">
                {otherNotes.map((notes) => (
                  <div
                    key={notes._id || notes.createdAt}
                    onClick={() =>
                      handleNoteClick(notes._id, notes.title, notes.description)
                    }
                    style={{ backgroundColor: notes.color }}
                    className="text-white p-4 rounded-md  shadow-sm w-[250px] h-[200px] relative hover:shadow-black/70 hover:shadow-xl transition-all duration-200  group"
                  >
                     {/* labels */}
                     <div className=" hidden group-hover:flex absolute bottom-8 left-3 gap-y-1 gap-x-2 flex-wrap w-full">
                        {notes.labels.map((label, index) => (
                          <div
                            key={index}
                            className=" bg-white/15 flex items-center gap-2 text-xs py-1 px-2 rounded-4xl"
                          >
                            <span>{label}</span>
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveLabel(notes._id,label);
                              }}
                              className="font-semibold w-4 h-4 rounded-full bg-white/20 flex items-center justify-center cursor-pointer"
                            >
                              x
                            </span>
                          </div>
                        ))}
                      </div>
                    {/* Created time & date */}
                    <p className="hidden group-hover:block absolute bottom-1.5 left-3 text-xs text-white/60">
                      {new Date(notes.createdAt).toLocaleDateString()}
                    </p>
                    {/* pinned button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePin(notes._id);
                      }}
                      className="hidden group-hover:block absolute bg-black/45 px-2 py-1 cursor-pointer rounded-md text-white right-1 bottom-1.5"
                    >
                      <TbPinned />
                    </button>
                    {/* delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotes(notes._id);
                      }}
                      className="hidden group-hover:block absolute bg-black/45 px-2 py-1 cursor-pointer rounded-md text-white right-11 bottom-1.5"
                    >
                      <MdDelete />
                    </button>
                    {/* label button */}
                    <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLabelInputVisible(
                            labelInputVisible === notes._id ? false : notes._id
                          );
                        }}
                        className="hidden group-hover:block absolute bg-black/45 px-2 py-1 cursor-pointer rounded-md text-white right-22 bottom-1.5"
                      >
                        <MdLabelImportantOutline />
                      </button>
                      {/* notes card */}
                    <h3 className="font-semibold text-lg text-white/70">
                      {notes.title}
                    </h3>
                    <hr className="text-white/70 mb-3" />
                    <p className="text-sm">{notes.description}</p>
                    {/* label input field */}
                    <div onClick={(e) => e.stopPropagation()}>
                        {labelInputVisible === notes._id && (
                          <div className="absolute -bottom-16 -right-1 shadow-md bg-black/50 p-5 text-sm rounded-3xl z-10">
                            <div className="w-[170px] flex px-2 py-1 border border-gray-600/60 rounded-md">
                              <input
                                type="text"
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                                // autoFocus
                                // onBlur={() => setLabelInputVisible(false)} 
                                placeholder="Add Label"
                                className=" outline-none w-full"
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddLabel(notes._id);
                                }}
                                className=" text-white/80 rounded-full text-xl bg-white/20 w-5 h-5 flex items-center justify-center cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 bg-black/50 p-5 rounded-lg w-[600px] text-center shadow-md">
            <h2 className="font-semibold text-2xl text-white/90 mb-5">
              {editingId ? "Edit Note" : "Create a Note"}
            </h2>
            <input
              placeholder="Title..."
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="w-full rounded-md mt-2 outline-none border border-[#ccc] bg-white/50 p-4"
            ></input>
            <textarea
              placeholder="Description..."
              rows="7"
              value={noteDescription}
              onChange={(e) => setNoteDescription(e.target.value)}
              className="w-full rounded-md mt-2 outline-none border border-[#ccc] bg-white/50 p-4"
            ></textarea>
            <div className="mt-2">
              <button
                onClick={saveNote}
                className="mr-2 px-5 py-3 bg-[#007BFF] text-white border-none rounded-md cursor-pointer"
              >
                {editingId ? "Update" : "Save"}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className=" px-5 py-3 bg-[#ccc] text-[#333] border-none rounded-md cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContainer;
