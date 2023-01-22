const range = document.querySelector(
  "input[name=master-volume]"
) as HTMLInputElement;

const circleEl = document.querySelector("#beats-icon");
const outerRim = document.querySelector("#outer-rim") as SVGElement;

function handleRange(e: Event) {
  const target = e.target as HTMLInputElement;

  frame(+target.value);
}

let currentPointer: number | null = null;

range.addEventListener("input", handleRange);
function init() {
  frame(0.25);
}

function handlePointerUp(e: Event) {
  const evt = e as PointerEvent;
  circleEl?.releasePointerCapture(evt.pointerId);
  currentPointer = null;
}

function handlePointerDown(e: Event) {
  const evt = e as PointerEvent;
  console.log(`pointerdown: id = ${evt.pointerId}`);
  currentPointer = evt.pointerId;
  circleEl?.setPointerCapture(evt.pointerId);
}
function handlePointerMove(e: Event) {
  const evt = e as PointerEvent;
  if (currentPointer !== evt.pointerId) return;
  console.log(evt.movementX, evt.movementY);

  console.log(`pointermove: id = ${evt.pointerId}`);
}
if (circleEl) {
  circleEl.addEventListener("pointerdown", handlePointerDown);
  circleEl?.addEventListener("pointerup", handlePointerUp, false);

  circleEl?.addEventListener("pointermove", handlePointerMove, false);
}

function frame(cycleCompletion: number) {
  const circleWidth = parseInt(outerRim.getAttribute("r") as string) * 2;
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
    parseInt(outerRim.getAttribute("cx") as string) -
      parseInt(outerRim.getAttribute("r") as string)
  );

  const cosineMappedToArtboard =
    (cosine / 2 + 0.5) * circleWidth + xCircleMargin - 12;
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
    parseInt(outerRim.getAttribute("cy") as string) -
      parseInt(outerRim.getAttribute("r") as string)
  );
  const sineMappedToArtboard =
    circleWidth + yCircleMargin - (sine / 2 + 0.5) * circleWidth - 12;

  circleEl?.setAttribute("x", cosineMappedToArtboard.toString());
  circleEl?.setAttribute("y", sineMappedToArtboard.toString());
  // circleEl?.setAttribute("style", "transform: scale(0.5)");
  //circleEl?.setAttribute(
  //   "style",
  //   `transform: translate(${cosineMappedToArtboard.toString()}px, ${sineMappedToArtboard.toString()}px);`
  // );

  console.log("cycleCompletion", cycleCompletion);
  console.log("cosine", cosine);
  console.log("cosineMappedToArtboard", cosineMappedToArtboard);
  console.log("sine", sine);
  console.log("sineMappedToArtboard", sineMappedToArtboard);
}

init();

export {};
