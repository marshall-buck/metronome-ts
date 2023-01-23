const ICON_RADIUS = 48;

let downY = 0;
let dy = 0;

const range = document.querySelector(
  "input[name=master-volume]"
) as HTMLInputElement;

const settingsIcon = document.querySelector("#settings-icon") as SVGElement;
const beatsIcon = document.querySelector("#beats-icon") as SVGElement;
const bpmIcon = document.querySelector("#bpm-icon") as SVGElement;
const timeSigIcon = document.querySelector("#time-sig-icon") as SVGElement;
const volumeIcon = document.querySelector("#volume-icon") as SVGElement;

const topCircle = document.querySelector("#top-circle") as SVGElement;
const bottomCircle = document.querySelector("#bottom-circle") as SVGElement;

const topArc = document.querySelector("#top-arc") as SVGElement;
const bottomArc = document.querySelector("#bottom-arc") as SVGElement;

/** Initialize App */
function init() {
  iconAnimation(0, beatsIcon, topCircle);
  iconAnimation(-0.75, timeSigIcon, topCircle);
  iconAnimation(0, settingsIcon, bottomCircle);
  iconAnimation(0.25, bpmIcon, bottomCircle);
  iconAnimation(0.5, volumeIcon, bottomCircle);
}

function handleRange(e: Event) {
  const target = e.target as HTMLInputElement;

  iconAnimation(+target.value, beatsIcon, topCircle);
}

let currentPointer: number | null = null;

range.addEventListener("input", handleRange);

function handlePointerUp(e: Event) {
  const evt = e as PointerEvent;
  beatsIcon?.releasePointerCapture(evt.pointerId);
  currentPointer = null;
  dy = 0;
}

function handlePointerDown(e: Event) {
  const evt = e as PointerEvent;
  console.log(`pointerdown: id = ${evt.pointerId}`);
  currentPointer = evt.pointerId;

  beatsIcon?.setPointerCapture(evt.pointerId);
}

function handlePointerMove(e: Event) {
  const evt = e as PointerEvent;
  const target = evt.target as SVGElement;
  if (currentPointer !== evt.pointerId) return;
  if (evt.movementY !== 0) dy += evt.movementY;
  // const min = 0;
  // const max = 100;

  // Clamp number between two values with the following line:
  const clamp = (num: number, min: number, max: number) =>
    Math.min(Math.max(num, min), max);

  console.log(dy * 0.001);
  console.log(evt.movementY);

  iconAnimation(clamp(dy * -0.001, -0.25, 0.25), beatsIcon, topCircle);

  // console.log(`pointermove: id = ${evt.pointerId}`);
}
if (beatsIcon) {
  beatsIcon.addEventListener("pointerdown", handlePointerDown);
  beatsIcon?.addEventListener("pointerup", handlePointerUp, false);

  beatsIcon?.addEventListener("pointermove", handlePointerMove, false);
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
  // to the circle's bounds in the SVG artboard, 10 to 90.

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
  // to our circle's bounds in the SVG artboard, 10 to 90.
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
  // circleEl?.setAttribute("style", "transform: scale(0.5)");
  //circleEl?.setAttribute(
  //   "style",
  //   `transform: translate(${cosineMappedToArtboard.toString()}px, ${sineMappedToArtboard.toString()}px);`
  // );

  // console.log("cycleCompletion", cycleCompletion);
  // console.log("cosine", cosine);
  // console.log("cosineMappedToArtboard", cosineMappedToArtboard);
  // console.log("sine", sine);
  // console.log("sineMappedToArtboard", sineMappedToArtboard);
}

init();

export {};
