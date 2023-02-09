import "./style.css";

import { UIController } from "./UIController";
import { TOP_CENTER, BOTTOM_CENTER } from "./config";

// const TOP_CENTER = { x: 176.3, y: 177.318 };
// const BOTTOM_CENTER = { x: 176.3, y: 477.318 };

let currentPointer: number | null = null;
let currentIconRotation = 0;
let currentSymbolRotation = 0;
let currentMousePosition = { x: 0, y: 0 };

let dy = 0;
let dx = 0;

// const toSVGPoint = (svg, x, y) => {
//   let p = new DOMPoint(x, y);
//   return p.matrixTransform(svg.getScreenCTM().inverse());
// };
function handlePointerUp(e: Event) {
  const evt = e as PointerEvent;
  const icon = UIController.getCurrentIcon(e);

  icon?.iconGroup?.releasePointerCapture(evt.pointerId);
  currentPointer = null;

  icon?.setHomePosition(TOP_CENTER);
  dy = 0;
  dx = 0;
}

function handlePointerDown(e: Event) {
  const evt = e as PointerEvent;

  currentPointer = evt.pointerId;
  currentMousePosition.x = evt.x;
  currentMousePosition.y = evt.y;
  const icon = UIController.getCurrentIcon(e);

  icon?.iconGroup?.setPointerCapture(evt.pointerId);
}

function handlePointerMove(e: Event) {
  const evt = e as PointerEvent;
  dy = evt.y - currentMousePosition.y;
  dx = evt.x - currentMousePosition.x;
  if (currentPointer !== evt.pointerId) return;
  UIController.controlAnimation(e, dy);
}

export { handlePointerDown, handlePointerUp, handlePointerMove };
