import "./style.css";

import { UIController } from "./UIController";

let currentPointer: number | null = null;
let currentIconRotation = 0;
let currentSymbolRotation = 0;
let currentMousePosition = { x: 0, y: 0 };

let dy = 0;
let dx = 0;

function handlePointerUp(e: Event) {
  const evt = e as PointerEvent;
  const icon = UIController.getCurrentIcon(evt);

  icon?.iconGroup?.releasePointerCapture(evt.pointerId);
  currentPointer = null;

  icon?.setHomePosition();

  dy = 0;
  dx = 0;
}

function handlePointerDown(e: Event) {
  const evt = e as PointerEvent;

  currentPointer = evt.pointerId;
  currentMousePosition.x = evt.x;
  currentMousePosition.y = evt.y;
  const icon = UIController.getCurrentIcon(evt);

  icon?.iconGroup?.setPointerCapture(evt.pointerId);
}

function handlePointerMove(e: Event) {
  const evt = e as PointerEvent;
  dy = evt.y - currentMousePosition.y;
  dx = evt.x - currentMousePosition.x;
  if (currentPointer !== evt.pointerId) return;
  UIController.controlAnimation(evt, dy);
}

export { handlePointerDown, handlePointerUp, handlePointerMove };
