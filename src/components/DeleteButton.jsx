import { useContext } from "react";
import { db } from "../appwrite/databases";
import { Trash } from "../icons/Trash";
import { NoteContext } from "../contexts/NoteContext";

function DeleteButton({ noteId }) {
  const { setNotes } = useContext(NoteContext);

  async function handleDelete() {
    db.notes.delete(noteId);
    setNotes((notes) => notes.filter((note) => note.$id !== noteId));
  }
  return (
    <div onClick={handleDelete}>
      <Trash />
    </div>
  );
}

export default DeleteButton;
