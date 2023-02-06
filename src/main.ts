import "./style.css";
import { Icon, IconController } from "./view/icons";
const ICON_RADIUS = 24;
const eventHandlers = {
  pointerDown: handlePointerDown,
  pointerMove: handlePointerMove,
  pointerUp: handlePointerUp,
};
// const beatsIconGroup = document.querySelector("#beats") as SVGElement;
const beatsIcon = new Icon({
  iconGroup: "#beats",

  ...eventHandlers,
});
const timeSigIcon = new Icon({
  iconGroup: "#time-signature",

  ...eventHandlers,
});
const volume = new Icon({
  iconGroup: "#volume",

  ...eventHandlers,
});
const iconController = new IconController([beatsIcon, timeSigIcon, volume]);
const beatsSymbol = document.querySelector("#beats-symbol") as SVGElement;
const topCircle = document.querySelector("#top-bg") as SVGElement;
const mainSVGContainer = document.querySelector("#main-svg") as SVGElement;
const TOP_CENTER = { x: 179.619, y: 178.794 };
const BOTTOM_CENTER = { x: 179.619, y: 378.794 };
let currentPointer: number | null = null;
let currentIconRotation = 0;
let currentSymbolRotation = 0;
let currentMousePosition = { x: 0, y: 0 };

let dy = 0;
let dx = 0;
function handlePointerUp(e: Event) {
  // const evt = e as PointerEvent;
  // beatsIcon.iconGroup?.releasePointerCapture(evt.pointerId);
  // currentPointer = null;
  // beatsIcon.iconGroup?.setAttribute(
  //   "transform",
  //   `rotate(0,${TOP_CENTER.x}, ${TOP_CENTER.y})`
  // );
  // beatsSymbol.setAttribute("transform", `rotate(0 ,327.144,180.297)`);
  // dy = 0;
  // dx = 0;
  // // console.log("pointerup", e);
}

function handlePointerDown(e: Event) {
  const evt = e as PointerEvent;
  // console.log(e);

  // console.log(`pointerdown: id = ${evt.pointerId}`);
  // const target = evt.target as SVGElement;
  const target = evt.target as HTMLElement;
  // console.log(target);

  currentPointer = evt.pointerId;
  currentMousePosition.x = evt.x;
  currentMousePosition.y = evt.y;
  const icon = IconController.handlePointerDown(e);
  icon?.iconGroup?.setPointerCapture(evt.pointerId);

  // beatsIcon.element?.setPointerCapture(evt.pointerId);
}

function handlePointerMove(e: Event) {
  // const evt = e as PointerEvent;
  // dy = evt.y - currentMousePosition.y;
  // dx = evt.x - currentMousePosition.x;
  // if (currentPointer !== evt.pointerId) return;
  // // Clamp number between two values with the following line:
  // const clamp = (num: number, min: number, max: number) =>
  //   Math.min(Math.max(num, min), max);
  // beatsIcon.iconGroup?.setAttribute(
  //   "transform",
  //   `rotate(${clamp(dy * 0.5, -90, 90)} ,${TOP_CENTER.x}, ${TOP_CENTER.y})`
  // );
  // currentIconRotation = clamp(dy * 0.5, -90, 90);
  // beatsSymbol.setAttribute("transform", `rotate(${dy * 5} ,327.144,180.297)`);
  // currentSymbolRotation = dy * 5;
}
// if (beatsIconGroup) {
//   beatsIconGroup.addEventListener("pointerdown", handlePointerDown);
//   beatsIconGroup?.addEventListener("pointerup", handlePointerUp, false);

//   beatsIconGroup?.addEventListener("pointermove", handlePointerMove, false);
// }
// function handlePointerUp(e: Event) {
//   const evt = e as PointerEvent;
//   beatsIconGroup?.releasePointerCapture(evt.pointerId);
//   currentPointer = null;
//   beatsIconGroup.setAttribute(
//     "transform",
//     `rotate(0,${TOP_CENTER.x}, ${TOP_CENTER.y})`
//   );
//   beatsSymbol.setAttribute("transform", `rotate(0 ,327.144,180.297)`);

//   dy = 0;
//   dx = 0;
//   console.log("pointerup", e);
// }

// function handlePointerDown(e: Event) {
//   const evt = e as PointerEvent;
//   console.log(`pointerdown: id = ${evt.pointerId}`);
//   // const target = evt.target as SVGElement;

//   currentPointer = evt.pointerId;
//   currentMousePosition.x = evt.x;
//   currentMousePosition.y = evt.y;
//   beatsIconGroup?.setPointerCapture(evt.pointerId);

//   console.log("clientBox", beatsIcon.element?.getBoundingClientRect());
//   // console.log("mainbBox", mainSVGContainer.getBBox());
//   console.log("main", mainSVGContainer.getBoundingClientRect());
// }

// function handlePointerMove(e: Event) {
//   const evt = e as PointerEvent;
//   dy = evt.y - currentMousePosition.y;
//   dx = evt.x - currentMousePosition.x;
//   if (currentPointer !== evt.pointerId) return;

//   // Clamp number between two values with the following line:
//   const clamp = (num: number, min: number, max: number) =>
//     Math.min(Math.max(num, min), max);

//   beatsIconGroup.setAttribute(
//     "transform",
//     `rotate(${clamp(dy * 0.5, -90, 90)} ,${TOP_CENTER.x}, ${TOP_CENTER.y})`
//   );
//   currentIconRotation = clamp(dy * 0.5, -90, 90);
//   beatsSymbol.setAttribute("transform", `rotate(${dy * 5} ,327.144,180.297)`);
//   currentSymbolRotation = dy * 5;
// }
