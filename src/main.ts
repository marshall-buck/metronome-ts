import "./style.css";

import { Icon } from "./Icon";

import { UIController } from "./UIController";
// const mainSvg = document.querySelector("#main-svg") as SVGElement;

let currentPointer: number | null = null;
let currentIconRotation = 0;
let currentSymbolRotation = 0;
let currentMousePosition = { x: 0, y: 0 };
let activeIcon: Icon | null;

let dy = 0;
let dx = 0;
/**Handles pointer up events */
function handlePointerUp(e: Event) {
  const evt = e as PointerEvent;
  activeIcon = UIController.getCurrentIcon(evt);

  activeIcon?.iconGroup?.releasePointerCapture(evt.pointerId);

  activeIcon?.setHomePosition();
  activeIcon = null;
  currentPointer = null;
  dy = 0;
  dx = 0;
}
/**Handles Pointer down events */
function handlePointerDown(e: Event) {
  const evt = e as PointerEvent;

  currentPointer = evt.pointerId;
  currentMousePosition.x = evt.x;
  currentMousePosition.y = evt.y;
  activeIcon = UIController.getCurrentIcon(evt);

  activeIcon?.iconGroup?.setPointerCapture(evt.pointerId);
  if (activeIcon?.name === "settings") UIController.settingsIconDown();
}
/**Handles pointer moving events while moving icons */
function handlePointerMove(e: Event) {
  const evt = e as PointerEvent;
  dy = evt.y - currentMousePosition.y;
  dx = evt.x - currentMousePosition.x;
  if (currentPointer !== evt.pointerId) return;
  UIController.dragIcon(evt, dy);
}

export { handlePointerDown, handlePointerUp, handlePointerMove };
