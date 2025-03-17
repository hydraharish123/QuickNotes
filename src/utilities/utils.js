export const setNewOffset = (card, mouseMoveDir = { x: 0, y: 0 }) => {
  const offsetLeft = card.offsetLeft - mouseMoveDir.x;
  const offsetTop = card.offsetTop - mouseMoveDir.y;

  return {
    x: offsetLeft < 0 ? 0 : offsetLeft,
    y: offsetTop < 0 ? 0 : offsetTop,
  };
};

export function setZIndex(selectedCard) {
  selectedCard.style.zIndex = 999;
  Array.from(document.getElementsByClassName("card")).map(
    (card) => {
      if (selectedCard != card)
        card.style.zIndex = selectedCard.style.zIndex - 1;
    }
    // console.log(card)
  );
}

export function bodyParser(value) {
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
}
