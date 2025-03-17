import { useContext, useEffect, useRef, useState } from "react";
import { Trash } from "../icons/Trash";
import { setNewOffset, setZIndex, bodyParser } from "../utilities/utils";
import { db } from "../appwrite/databases";
import Spinner from "./Spinner";
import DeleteButton from "./DeleteButton";
import { NoteContext } from "../contexts/NoteContext";

function NoteCard({ note }) {
  const { setSelectedNote } = useContext(NoteContext);
  const [saving, setSaving] = useState(false);
  const keyUpTimer = useRef(null);
  //   let position = JSON.parse(note.position);
  const [position, setPosition] = useState(JSON.parse(note.position));
  const colors = JSON.parse(note.colors);
  const body = bodyParser(note.body);

  let mouseStartPos = { x: 0, y: 0 };

  const cardRef = useRef(null);
  const textAreaRef = useRef(null);

  useEffect(function () {
    autoGrow(textAreaRef);
    setZIndex(cardRef.current);
  }, []);

  const mouseUp = () => {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);

    const newPosition = setNewOffset(cardRef.current);
    console.log(newPosition);

    // db.notes.update(note.$id, {
    //   position: JSON.stringify(newPosition),
    // });

    saveData("position", newPosition);
  };

  async function saveData(key, value) {
    const payload = { [key]: JSON.stringify(value) };
    console.log(payload);

    try {
      db.notes.update(note.$id, payload);
    } catch (err) {
      console.error(err.message);
    }
    setSaving(false);
  }

  function mouseDown(e) {
    if (e.target.className === "card-header") {
      setZIndex(cardRef.current);
      // console.log(e.clientX);
      // console.log(e.clientY);
      // e.clientX and e.clientY give me the current position when i click on the header, because the event handler is on the card header
      // now store these positions as start positions
      mouseStartPos.x = e.clientX;
      mouseStartPos.y = e.clientY;

      setSelectedNote(note);

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
      // The mouse move event will capture EVERY movement of the users mouse, and will be responsible for updating our card position.
    }
  }

  function mouseMove(e) {
    // console.log(e.clientX, e.clientY);
    // this e.clientX and e.clientY, RECORDS MY MOUSE MOVEMENT WHEN I CLICK ON A HEADER
    // mouseStartPos.x and mouseStartPos.y has my initial cordinates
    // based on my mouse movement of the header when i click it, it calculates the new x and y cordinates and saves it into mouseMoveDir

    let mouseMoveDir = {
      x: mouseStartPos.x - e.clientX,
      y: mouseStartPos.y - e.clientY,
    };

    mouseStartPos.x = e.clientX;
    mouseStartPos.y = e.clientY;

    // since we updated the start position after each mouse move,
    // we need to somehow be able to get the initial cordinates
    //this can be done by offsetLeft and offsetTop

    // console.log(cardRef.current.offsetLeft);
    // console.log(cardRef.current.offsetTop);

    // this setPosition is responsible for moving the card from initial position to the next position
    // and the new cordinates are updated at mouseStartPos
    // setPosition({
    //   x: cardRef.current.offsetLeft - mouseMoveDir.x,
    //   y: cardRef.current.offsetTop - mouseMoveDir.y,
    // });

    const newPosition = setNewOffset(cardRef.current, mouseMoveDir);
    setPosition(newPosition);
  }

  function autoGrow(textAreaRef) {
    const { current } = textAreaRef;
    // console.log(current.style.height);
    current.style.height = "auto"; // Reset the height
    // console.log(current.style.height);
    // console.log(current.scrollHeight);

    current.style.height = current.scrollHeight + "px"; // Set the new height
  }

  const handleKeyUp = () => {
    setSaving(true);

    if (keyUpTimer.current) clearTimeout(keyUpTimer.current);

    keyUpTimer.current = setTimeout(
      () => saveData("body", textAreaRef.current.value),
      2000
    );
  };

  return (
    <div
      ref={cardRef}
      className="card"
      style={{
        backgroundColor: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        className="card-header"
        style={{
          backgroundColor: colors.colorHeader,
        }}
        onMouseDown={mouseDown}
      >
        <DeleteButton noteId={note.$id} />

        {saving && (
          <div className="card-saving">
            <Spinner color={colors.colorText} />
            <span style={{ color: colors.colorText }}>Saving...</span>
          </div>
        )}
      </div>
      <div className="card-body">
        <textarea
          onKeyUp={handleKeyUp}
          ref={textAreaRef}
          defaultValue={body}
          style={{
            color: colors.colorText,
          }}
          onInput={() => autoGrow(textAreaRef)}
          onFocus={() => {
            setSelectedNote(note);
            setZIndex(cardRef.current);
          }}
        ></textarea>
      </div>
    </div>
  );
}

export default NoteCard;
