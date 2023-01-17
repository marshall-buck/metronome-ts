import { createBgSvg } from "./backgroundSvg";
import { createBPMIcon } from "./bpmIcon";
import { getCenter, portOrLand, copyTouch } from "./helpers";
import { createSettingsIcon } from "./settingsIcon";
import { createTimeSigIcon } from "./timeSigIcon";
let isDragging = false;
const ongoingTouches = [];

window.addEventListener("resize", (_e: Event) => {
  const center = getCenter();
  const bgSvg = document.querySelector("#bg") as SVGElement;
  const bgCircle = document.querySelector("#bg-circle") as SVGElement;
  const radius =
    portOrLand() === "portrait"
      ? window.innerWidth / 2
      : window.innerHeight / 2;
  const width = window.innerWidth.toString();
  const height = window.innerHeight.toString();

  bgSvg.setAttribute("width", `${width}`);
  bgSvg.setAttribute("height", `${height}`);
  bgCircle.setAttribute("cx", `${center.x}`);
  bgCircle.setAttribute("cy", `${center.y}`);
  bgCircle.setAttribute("r", `${radius}`);
});
function init() {
  const root = document.querySelector("#app") as HTMLDivElement;

  const svg = createBgSvg();
  root.append(svg);

  createTimeSigIcon(svg);
  const bg = document.querySelector("#bg") as SVGElement;
  if (bg) {
    bg.addEventListener("pointerdown", handleTouchStart);
    bg.addEventListener("pointermove", handleMoveTimeSig);
    bg.addEventListener("pointerup", handleReleaseTimeSig);
  }
}
init();
const timeSig: SVGElement | null = document.querySelector("#time-signature");

function handleTouchStart(e: PointerEvent) {
  isDragging = true;
  console.log(timeSig?.getBoundingClientRect());

  console.log("pointerdown", e.pointerId);
  ongoingTouches.push(copyTouch(e));
}
function handleMoveTimeSig(e: PointerEvent) {
  if (!isDragging) return;
  console.log("pointermove", e);
}
function handleReleaseTimeSig(e: PointerEvent) {
  isDragging = false;
  console.log("pointerup", e);
}

function copyTouch(touch: PointerEvent) {
  return {
    identifier: touch.pointerId,
    pageX: touch.clientX,
    pageY: touch.clientY,
  };
}

// window.requestAnimationFrame(frame);

function isInsideCircle(
  x: number,
  y: number,
  radius: number,
  mouseX: number,
  mouseY: number
): boolean {
  if (
    mouseX >= x - radius &&
    mouseX <= x + radius &&
    mouseY >= y - radius &&
    mouseY <= y + radius
  )
    return true;

  return false;
}
function rotate(x: number, y: number): number {
  const center = getCenter();
  var deltaX = x - center.x,
    deltaY = y - center.y,
    // The atan2 method returns a numeric value between -pi and pi representing the angle theta of an (x,y) point.
    // This is the counterclockwise angle, measured in radians, between the positive X axis, and the point (x,y).
    // Note that the arguments to this function pass the y-coordinate first and the x-coordinate second.
    // atan2 is passed separate x and y arguments, and atan is passed the ratio of those two arguments.
    // * from Mozilla's MDN

    // Basically you give it an [y, x] difference of two points and it give you back an angle
    // The 0 point of the angle is left (the initial position of the picker is also left)

    angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

  // Math.atan2(deltaY, deltaX) => [-PI +PI]
  // We must convert it to deg so...
  // / Math.PI => [-1 +1]
  // * 180 => [-180 +180]
  /* 			console.log(angle) */
  return angle;
}

// mousemove = function(event){
//   /* 		picker.style[transform] = 'rotate(' + rotate(event.pageX, event.pageY) + 'deg)' */
// /*      console.log(event.pageX, event.pageY) */

//         const rotated = rotate(event.pageX, event.pageY)
//         if(rotated > 0 && rotated< 90) {
//             console.log(rotated)
//       picker.style.transform = `rotate(${rotated}deg)`
//         }

export {};
