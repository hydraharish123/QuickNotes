import Plus from "../icons/Plus";
import colors from "../assets/colors.json";
import { useContext, useRef } from "react";
import { db } from "../appwrite/databases";
import { NoteContext } from "../contexts/NoteContext";

function AddButton() {
  const startingPos = useRef(10);
  const { setNotes } = useContext(NoteContext);

  async function addNote() {
    const payload = {
      position: JSON.stringify({
        x: startingPos.current,
        y: startingPos.current,
      }),
      colors: JSON.stringify(colors[0]),
    };

    startingPos.current += 10;
    const response = await db.notes.create(payload);
    setNotes((prevState) => [response, ...prevState]);
    console.log(response);
  }
  return (
    <div id="add-btn" onClick={addNote}>
      <Plus />
    </div>
  );
}

export default AddButton;
