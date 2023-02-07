import "./style.css";
import { Icon, IconController } from "./view/icons";
const ICON_RADIUS = 24;
const eventHandlers = {
  pointerDown: handlePointerDown,
  pointerMove: handlePointerMove,
  pointerUp: handlePointerUp,
};
const TOP_CENTER = { x: 179.619, y: 178.794 };
const BOTTOM_CENTER = { x: 179.619, y: 478.794 };
// const beatsIconGroup = document.querySelector("#beats") as SVGElement;

const beatsIcon = new Icon({
  iconGroup: "#beats",
  degreeConstraints: { min: -90, max: 90 },
  ...eventHandlers,
});
const timeSigIcon = new Icon({
  iconGroup: "#time-signature",
  degreeConstraints: { min: 0, max: 180 },
  ...eventHandlers,
});
const volume = new Icon({
  iconGroup: "#volume",
  degreeConstraints: { min: -90, max: 90 },
  invertAxis: true,
  ...eventHandlers,
});
const bpm = new Icon({
  iconGroup: "#bpm",
  degreeConstraints: { min: -90, max: 90 },
  invertAxis: true,
  ...eventHandlers,
});
const iconController = new IconController([
  beatsIcon,
  timeSigIcon,
  volume,
  bpm,
]);
const beatsSymbol = document.querySelector("#beats-symbol") as SVGElement;
const topCircle = document.querySelector("#top-bg") as SVGElement;
const mainSVGContainer = document.querySelector("#main-svg") as SVGElement;

let currentPointer: number | null = null;
let currentIconRotation = 0;
let currentSymbolRotation = 0;
let currentMousePosition = { x: 0, y: 0 };

let dy = 0;
let dx = 0;
function handlePointerUp(e: Event) {
  const evt = e as PointerEvent;
  const icon = IconController.getCurrentIcon(e);

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
  const icon = IconController.getCurrentIcon(e);
  icon?.iconGroup?.setPointerCapture(evt.pointerId);
}

function handlePointerMove(e: Event) {
  const evt = e as PointerEvent;
  dy = evt.y - currentMousePosition.y;
  dx = evt.x - currentMousePosition.x;
  if (currentPointer !== evt.pointerId) return;
  const icon = IconController.getCurrentIcon(e);
  if (icon?.iconGroupId !== "#bpm") {
    if (!icon?.invertAxis) icon?.rotateIcon(dy, TOP_CENTER);
    else icon?.rotateIcon(dy, BOTTOM_CENTER);
  } else {
    if (dy < 0) {
      bpm.invertAxis = false;
    }

    if (dy > 0) {
      bpm.invertAxis = true;
    }
    if (!bpm.invertAxis) icon?.rotateIcon(dy, TOP_CENTER);
    else icon?.rotateIcon(dy, BOTTOM_CENTER);
  }

  // currentIconRotation = clamp(dy * 0.5, -90, 90);

  // currentSymbolRotation = dy * 5;
}
