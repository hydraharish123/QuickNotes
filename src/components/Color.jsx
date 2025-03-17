import { useContext } from "react";
import { NoteContext } from "../contexts/NoteContext";
import { db } from "../appwrite/databases";
import toast from "react-hot-toast";

function Color({ color }) {
  const { selectedNote, notes, setNotes } = useContext(NoteContext);
  function handleColorChange() {
    // console.log("color clicked", color);
    try {
      const currentNoteIndex = notes.findIndex(
        (note) => note.$id === selectedNote.$id
      );

      const updatedNote = {
        ...notes[currentNoteIndex],
        colors: JSON.stringify(color),
      };

      const newNotes = [...notes];
      newNotes[currentNoteIndex] = updatedNote;
      setNotes(newNotes);

      db.notes.update(selectedNote.$id, { colors: JSON.stringify(color) });
    } catch (err) {
      console.error(err.message);
      toast.error("Please select a note to change the color");
    }
  }
  return (
    <div
      className="color"
      style={{ backgroundColor: color.colorHeader }}
      onClick={handleColorChange}
    ></div>
  );
}

export default Color;
