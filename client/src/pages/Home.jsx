import React,{useState,useEffect} from "react";
import ColorPicker from "../components/ColorPicker";
import NotesSection from "../components/NotesSection";
import NoteModal from "../components/NoteModal";
import SearchBar from "../components/SearchBar";
import { API } from "../services/API";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/themeSlice";
import { TbBulb, TbBulbFilled } from "react-icons/tb";



const Home = () => {

  const dispatch = useDispatch()
  const theme = useSelector((state) => state.theme.theme)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [draggedColor, setDraggedColor] = useState("");
    const [tempCard,setTempCard] = useState(false);
    const [noteTitle, setNoteTitle] = useState("");
    const [noteDescription, setNoteDescription] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [pinnedNotes, setPinnedNotes] = useState([]);
    const [otherNotes, setOtherNotes] = useState([]);
    const [newLabel, setNewLabel] = useState("");
    const [labelInputVisible, setLabelInputVisible] = useState(false);
  

  const colors = ["#319b79", "#26735b", "#1a4c3c", "#0d261e", "#000000"];

  const handleDragStart = (color) => {
    setDraggedColor(color); // Save the dragged sphere's color
  };


  const handleDragOver = (e) =>{
    e.preventDefault();
    setTempCard(true)
  }
   
  const handleDragLeave = () =>{
    setTempCard(false)
  }

  const handleDrop = (e) => {
    e.preventDefault();
    setEditingId(null);
    setNoteTitle("");
    setNoteDescription("");
    setTempCard(false)
    setIsModalOpen(true);
  };

  const handleNoteClick = (id, title, description) => {
    setEditingId(id);
    setNoteTitle(title);
    setNoteDescription(description);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);


  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await API.get("/api/notes/get");
        console.log("fetched data :", res.data);
        if (Array.isArray(res.data)) {
          setPinnedNotes(res.data.filter((note) => note.pinned).reverse());
          setOtherNotes(res.data.filter((note) => !note.pinned).reverse());
        } else if (res.data && typeof res.data === "object") {
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

  

  const saveNote = async () => {
    if (noteTitle.trim() && noteDescription.trim()) {
      try {
        if (editingId) {
          // update existing note
          const updatedNote = await API.put(`/api/notes/edit/${editingId}`, {
            title: noteTitle,
            description: noteDescription,
          });
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
          // create new note
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

  const deleteNotes = async (id) => {
    try {
      await API.delete(`/api/notes/delete/${id}`);
      setPinnedNotes((prev) => prev.filter((note) => note._id !== id));
      setOtherNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Failed to delete notes:", error);
    }
  };

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
        setLabelInputVisible(false);
      } catch (error) {
        console.error("Failed to add label", error);
      }
    }
  };

  const handleRemoveLabel = async (id, labelToRemove) => {
    try {
      const updatedNote = await API.delete(`api/notes/remove-label/${id}`, {
        data: { label: labelToRemove },
      });
      setPinnedNotes((prev) =>
        prev.map((note) =>
          note._id === id
            ? {
                ...note,
                labels: note.labels.filter((label) => label !== labelToRemove),
              }
            : note
        )
      );
      setOtherNotes((prev) =>
        prev.map((note) =>
          note._id === id
            ? {
                ...note,
                labels: note.labels.filter((label) => label !== labelToRemove),
              }
            : note
        )
      );
    } catch (error) {
      console.error("Failed to remove label", error);
    }
  };

  return (
    <div className={`w-[100vw] h-[100vh] ${theme === "dark" ? "text-white" : "text-black"} secondary-font`}>
      <div className="flex gap-10 w-full h-full">
        {/* color picker spheres */}
        <ColorPicker colors={colors} handleDragStart={handleDragStart} />

        {/* Main Drop Area */}
        <div onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop} className="w-[98%] flex flex-col items-center justify-center">
          {/* Headline */}
          <h1 className="primary-font text-2xl font-semibold mt-6">Whatever</h1>
          {/* Search Bar */}
          <div className="mt-6 mb-10 w-full flex justify-center items-center gap-2">
            <SearchBar/>
            <button onClick={() => dispatch(toggleTheme())} className={`p-3 text-2xl rounded-full text-white ${theme === "dark"? "bg-gray-700":"bg-gray-400"}`}>{theme === "dark"? <TbBulbFilled/>: <TbBulb/>}</button>
          </div>

         {/* Temporary Notes Card while dragging
           {tempCard && (
            <div onDrag={handleDrag}  style={{ backgroundColor: draggedColor, top: tempCardPosition.y -20, left:tempCardPosition.x -100, pointerEvents:"none" }} className="text-white p-4 rounded-md shadow-sm w-[250px] h-[200px] relative hover:shadow-black/70 hover:shadow-xl">
               <h3 className="font-semibold text-lg text-white/70">
                New Note
              </h3>
              <hr className="text-white/70 mb-3" />
              <p className="text-sm">Drop to Add...</p>
            </div>
          )} */}



          {/* Notes Area */}
          <div onDrop={(e)=> e.preventDefault()} className="flex flex-wrap gap-3 w-full h-full py-7 ">
            {pinnedNotes.length > 0 && (
              <NotesSection 
                title="PINNED"
                notes={pinnedNotes}
                onNoteClick={handleNoteClick}
                onTogglePin={togglePin}
                onDelete={deleteNotes}
                labelInputVisible={labelInputVisible}
                setLabelInputVisible={setLabelInputVisible}
                newLabel={newLabel}
                setNewLabel={setNewLabel}
                handleAddLabel={handleAddLabel}
                handleRemoveLabel={handleRemoveLabel}
              />
            )}

            <NotesSection
              title="OTHERS"
              notes={otherNotes? [...otherNotes, ...(tempCard ? [{id:"temp", color:draggedColor}] : [])] : []}
              onNoteClick={(note) => {
                if (note.id === "temp") return;
                handleNoteClick(note._id, note.title, note.description)
              }}
              onTogglePin={togglePin}
              onDelete={deleteNotes}
              labelInputVisible={labelInputVisible}
              setLabelInputVisible={setLabelInputVisible}
              newLabel={newLabel}
              setNewLabel={setNewLabel}
              handleAddLabel={handleAddLabel}
              handleRemoveLabel={handleRemoveLabel}
            />
          </div>
        </div>

        {/* Modal */}
        <NoteModal
          isModalOpen={isModalOpen}
          noteTitle={noteTitle}
          noteDescription={noteDescription}
          setNoteTitle={setNoteTitle}
          setNoteDescription={setNoteDescription}
          saveNote={saveNote}
          closeModal={closeModal}
          editingId={editingId}
        />
      </div>
    </div>
  );
};

export default Home;
