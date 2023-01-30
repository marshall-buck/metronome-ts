import { getCenterOfObject } from "./helpers";
import "./style.css";
const ICON_RADIUS = 24;
const beatsIconGroup = document.querySelector("#beats") as SVGElement;
const beatsSymbol = document.querySelector("#beats-symbol") as SVGElement;
const topCircle = document.querySelector("#top-bg") as SVGElement;
const mainSVGContainer = document.querySelector("#main-svg") as SVGElement;
const TOP_CENTER = { x: 179.619, y: 178.794 };
const BOTTOM_CENTER = { x: 179.619, y: 378.794 };
let currentPointer: number | null = null;

let downY = 0;
let dy = 0;
function handlePointerUp(e: Event) {
  const evt = e as PointerEvent;
  beatsIconGroup?.releasePointerCapture(evt.pointerId);
  currentPointer = null;
  beatsIconGroup.setAttribute(
    "transform",
    `rotate(0,${TOP_CENTER.x}, ${TOP_CENTER.y})`
  );
  beatsSymbol.setAttribute("transform", `rotate(0 ,327.144,180.297)`);
  dy = 0;
}

function handlePointerDown(e: Event) {
  const evt = e as PointerEvent;
  console.log(`pointerdown: id = ${evt.pointerId}`);
  // const target = evt.target as SVGElement;

  currentPointer = evt.pointerId;

  beatsIconGroup?.setPointerCapture(evt.pointerId);
  // beatsSymbol.setAttribute("transform", `rotate(90 ,327.144,180.297)`);
  // <circle id="beats-bg" cx="327.144" cy="180.297" r="24" />
}

function handlePointerMove(e: Event) {
  const evt = e as PointerEvent;

  if (currentPointer !== evt.pointerId) return;
  if (evt.movementY !== 0) dy += evt.movementY;
  // const min = 0;
  // const max = 100;

  // Clamp number between two values with the following line:
  const clamp = (num: number, min: number, max: number) =>
    Math.min(Math.max(num, min), max);

  // console.log(dy * 0.001);
  // console.log(evt.movementY);
  // console.log(evt.x, evt.y);

  // iconAnimation(clamp(dy * -0.001, -0.25, 0.25), beatsIconGroup, topCircle);
  beatsIconGroup.setAttribute(
    "transform",
    `rotate(${clamp(dy * 0.5, -90, 90)} ,${TOP_CENTER.x}, ${TOP_CENTER.y})`
  );
  beatsSymbol.setAttribute("transform", `rotate(${dy * 5} ,327.144,180.297)`);

  // console.log(`pointermove: id = ${evt.pointerId}`);
}
if (beatsIconGroup) {
  beatsIconGroup.addEventListener("pointerdown", handlePointerDown);
  beatsIconGroup?.addEventListener("pointerup", handlePointerUp, false);

  beatsIconGroup?.addEventListener("pointermove", handlePointerMove, false);
}

function iconAnimation(
  cycleCompletion: number,
  icon: SVGElement,
  circleContainer: SVGElement
) {
  const circleWidth = parseInt(circleContainer.getAttribute("r") as string) * 2;
  // Completion of the circle's cycle in a range from 0 to 1

  // const cycleCompletion =
  //   (timestamp % cycleLengthInMilliseconds) / cycleLengthInMilliseconds;

  // Cosine is the horizontal (x) coordinate of the point
  // on the circle in a range from -1 to 1, respective
  // of the circle's completion cycle.
  const cosine = Math.cos(cycleCompletion * Math.PI * 2);

  // Since cosine is a range from -1 to 1, we map that range
  // to the circle's bounds in the SVG artboard.

  const xCircleMargin = Math.abs(
    parseInt(circleContainer.getAttribute("cx") as string) -
      parseInt(circleContainer.getAttribute("r") as string)
  );

  const cosineMappedToArtboard =
    (cosine / 2 + 0.5) * circleWidth + xCircleMargin - ICON_RADIUS;
  // circleEl?.setAttribute("cx", cosineMappedToArtboard);

  // Sine is the vertical (y) coordinate of the point
  // on the circle in a range from -1 to 1, respective
  // of the circle's completion cycle.
  const sine = Math.sin(cycleCompletion * Math.PI * 2);

  // Since the range of sine is -1 to 1, we map that range
  // to our circle's bounds in the SVG artboard.
  // We then subtract that value from the circleWidth and circleMargin,
  // since the SVG drawing coordinates are flipped upside down
  // compared to cartesian coordinates.

  const yCircleMargin = Math.abs(
    parseInt(circleContainer.getAttribute("cy") as string) -
      parseInt(circleContainer.getAttribute("r") as string)
  );
  const sineMappedToArtboard =
    circleWidth + yCircleMargin - (sine / 2 + 0.5) * circleWidth - ICON_RADIUS;

  icon?.setAttribute("x", cosineMappedToArtboard.toString());
  icon?.setAttribute("y", sineMappedToArtboard.toString());

  // console.log("cycleCompletion", cycleCompletion);
  // console.log("cosine", cosine);
  // console.log("cosineMappedToArtboard", cosineMappedToArtboard);
  // console.log("sine", sine);
  // console.log("sineMappedToArtboard", sineMappedToArtboard);
  console.log("x: ", cosineMappedToArtboard);
  console.log("y: ", sineMappedToArtboard);
}

// iconAnimation(0, beatsIconGroup, topCircle);

console.log("top circle", topCircle.getBoundingClientRect());
console.log("top circle cx", topCircle.getAttribute("cx"));
console.log("top circle cy", topCircle.getAttribute("cy"));

console.log("beats", beatsIconGroup.getBoundingClientRect());
console.log("main svg", mainSVGContainer.getBoundingClientRect());

//transform="rotate(-45,179,178)"
