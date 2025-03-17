import { createContext, useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { db } from "../appwrite/databases";

export const NoteContext = createContext();

function NoteProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(function () {
    async function init() {
      const response = await db.notes.list();

      //   const response = await databases.listDocuments(
      //     import.meta.env.VITE_DATABASE_ID,
      //     import.meta.env.VITE_COLLECTION_NOTES_ID
      //   );
      console.log(response.documents);
      setNotes(response.documents);
      setLoading(false);
    }

    init();
  }, []);

  const contextData = { notes, setNotes, selectedNote, setSelectedNote };
  return (
    <NoteContext.Provider value={contextData}>
      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Spinner size="100" />
        </div>
      ) : (
        children
      )}
    </NoteContext.Provider>
  );
}

export default NoteProvider;
