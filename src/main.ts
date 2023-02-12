import "./style.css";

import { Icon } from "./Icon";

import { IconController } from "./IconController";
import { mn } from "./metronomeModel/metronome";
import { PadController } from "./PadController";
PadController.drawInitialPads(12);
// PadController.animatePads();
let anF;
let currentPointer: number | null = null;
let currentIconRotation = 0;
let currentSymbolRotation = 0;
let currentMousePosition = { x: 0, y: 0 };
let activeIcon: Icon | null;

let dy = 0;
let dx = 0;
const bpmLabel = document.querySelector("#bpm-indicator") as SVGTextElement;

/**Handles Pointer down events */
function handlePointerDown(e: Event) {
  const evt = e as PointerEvent;

  currentPointer = evt.pointerId;
  currentMousePosition.x = evt.x;
  currentMousePosition.y = evt.y;
  activeIcon = IconController.getCurrentIcon(evt);

  activeIcon?.iconGroup?.setPointerCapture(evt.pointerId);
  if (activeIcon?.name === "settings") IconController.settingsIconDown();
}
/**Handles pointer moving events while moving icons */
function handlePointerMove(e: Event) {
  const evt = e as PointerEvent;
  dy = evt.y - currentMousePosition.y;
  dx = evt.x - currentMousePosition.x;
  if (currentPointer !== evt.pointerId) return;
  IconController.dragIcon(evt, dy);
  if (activeIcon?.name === "bpm") IconController.changeBpm(bpmLabel, dy);
}

/**Handles pointer up events */
function handlePointerUp(e: Event) {
  const evt = e as PointerEvent;
  activeIcon = IconController.getCurrentIcon(evt);

  activeIcon?.iconGroup?.releasePointerCapture(evt.pointerId);

  activeIcon?.setHomePosition();
  activeIcon = null;
  currentPointer = null;
  dy = 0;
  dx = 0;
}

/** return number of pads to draw */
function numberOfPads(beats: string): number {
  mn.timeSig = beats;
  return mn.timeSig.beats;
}

/******************* DRAW PADS CONTROL *****************************/
/** function to update the UI, so we can see when the beat progress.
 This is a loop: it reschedules itself to redraw at the end. */
function animatePads() {
  const drawNote = mn.shouldDrawNote();
  const pads = document.querySelectorAll(".beat");
  if (drawNote !== false) {
    pads.forEach((pad, idx) => {
      //  To highlight beat every n beats drawNote/ n
      // idx === drawNote / 2 will act like eight notes, must
      //  also set time sig beats to 8

      if (idx === (drawNote as number) / mn.drawBeatModifier) {
        pad.classList.toggle("active");
      } else pad.setAttribute("class", "beat");
    });
  }
  // Set up to draw again
  anF = requestAnimationFrame(animatePads);
}

export { handlePointerDown, handlePointerUp, handlePointerMove };
