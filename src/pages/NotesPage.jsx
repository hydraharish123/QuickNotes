// import { fakeData as notes } from "../assets/fakeData";
import { useContext } from "react";
import NoteCard from "../components/NoteCard";
import { NoteContext } from "../contexts/NoteContext";
import Controls from "../components/Controls";
// import { databases } from "../appwrite/config";

function NotesPage() {
  const { notes } = useContext(NoteContext);
  return (
    <div>
      {notes.map((note) => (
        <NoteCard key={note.$id} note={note} />
      ))}

      <Controls />
    </div>
  );
}

export default NotesPage;
