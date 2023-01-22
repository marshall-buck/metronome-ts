import { createBgSvg } from "./backgroundSvg";
import { createBPMIcon } from "./bpmIcon";
import { getCenter, portOrLand, copyTouch } from "./helpers";
import { createSettingsIcon } from "./settingsIcon";
import { createTimeSigIcon } from "./timeSigIcon";
let isDragging = false;
const ongoingTouches = [];

window.addEventListener("resize", (_e: Event) => {
  const center = getCenter(window.innerWidth, window.innerHeight);
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

  const time = createTimeSigIcon(svg);
  svg.append(time);
  // const bg = document.querySelector("#bg") as SVGElement;
  if (time) {
    time.addEventListener("pointerdown", handleTouchStart);
    time.addEventListener("pointermove", handleMoveTimeSig);
    time.addEventListener("pointerup", handleReleaseTimeSig);
  }
}
init();
const timeSig: SVGElement | null = document.querySelector("#time-signature");

function handleTouchStart(e: PointerEvent) {
  isDragging = true;

  const el = document
    .querySelector("#time-signature")
    ?.getBoundingClientRect() as SVGRect;
  const center = getCenter(el.width / 2, el.height / 2);
  const radius =
    portOrLand() === "portrait"
      ? window.innerWidth / 2
      : window.innerHeight / 2;
  console.log("radius", radius, "targetBounds", el);
  console.log(`mouse x ${e.x}, mousey ${e.y},  (${el.x + 24}, ${el.y + 24})`);
  const radians = Math.atan2(el.x - center.x, el.y - center.y);

  console.log(radians * (180 / Math.PI) * -1);

  console.log("radians", radians);

  // console.log("polarToCartesian", polarToCartesian(radius, 0));

  // ongoingTouches.push(copyTouch(e));
}

// const bgSvg = document.querySelector("#bg") as SVGElement;
// bgSvg.addEventListener("mousedown", (e) => console.log(e.x, e.y));
function handleMoveTimeSig(e: PointerEvent) {
  if (!isDragging) return;
  // console.log("pointermove", e);
  // const el = document
  //   .querySelector("#time-signature")
  //   ?.getBoundingClientRect() as DOMRect;

  // console.log(cartesianToPolar(el.x + 24, el.y + 24));

  // const current = (Math.atan2(el.x + 24, el.y + 24) * 180) / Math.PI;
  // console.log(current);
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

// mousemove = function(event){
//   /* 		picker.style[transform] = 'rotate(' + rotate(event.pageX, event.pageY) + 'deg)' */
// /*      console.log(event.pageX, event.pageY) */

//         const rotated = rotate(event.pageX, event.pageY)
//         if(rotated > 0 && rotated< 90) {
//             console.log(rotated)
//       picker.style.transform = `rotate(${rotated}deg)`
//         }

export {};
