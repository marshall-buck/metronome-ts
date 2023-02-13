import "./style.css";

import { Icon } from "./Icon";
import { clamp, isBetween } from "./helpers";

import { IconController } from "./IconController";
import { mn } from "./metronomeModel/metronome";
import { PadController } from "./PadController";
import { SvgDisplayController } from "./SvgDisplayController";
PadController.drawInitialPads(mn.timeSig.beats);

let anF;
let currentPointer: number | null = null;

let currentMousePosition = { x: 0, y: 0 };
let activeIcon: Icon | null;
const beatMods: string[] = ["quarter", "eight", "sixteenth", "trips"];

let dy = 0;

/** Handler to change Tempo based on mouse movement */
function handleChangeTempo(dy: number) {
  const mod = 0.1;
  const modifier = dy <= 0 ? mn.tempo + mod : mn.tempo - mod;
  mn.tempo = clamp(modifier, 20, 180);
  SvgDisplayController.displayBpm(mn.tempo);
}

/**Handles change in Volume */
function handleChangeVolume(dy: number) {
  const mod = -0.00005;
  const newVol = clamp(mn.masterVolume + dy * mod, 0.001, 1);

  SvgDisplayController.displayVolumeControl(newVol);

  mn.masterVolume = newVol;
  // console.log("from handler", mn.masterVolume);
}
/**Handles change in beats */
function handleChangeBeats(dy: number) {
  const mod = 0.05;

  let index: number;
  const beats = clamp(dy * mod * 0.25, -1.9, 1.9);
  if (isBetween(beats, -2, -1)) index = 0;
  else if (isBetween(beats, -1, 0)) index = 1;
  else if (isBetween(beats, 0, 1)) index = 2;
  else index = 3;

  SvgDisplayController.displayBeatsControlMove(beatMods[index]);
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

/**Handles Pointer down events */
function handlePointerDown(e: Event) {
  const evt = e as PointerEvent;

  currentPointer = evt.pointerId;
  currentMousePosition.x = evt.x;
  currentMousePosition.y = evt.y;
  activeIcon = IconController.getCurrentIcon(evt);

  activeIcon?.iconGroup?.setPointerCapture(evt.pointerId);

  switch (activeIcon?.name) {
    case "bpm":
      handleChangeTempo(dy);
      break;
    case "beats":
      SvgDisplayController.displayBeatsControlDown(beatMods[0]);
      break;
    case "time-signature":
      console.log("time-signature");
      break;
    case "volume":
      console.log("from click handler", mn.masterVolume);
      SvgDisplayController.displayVolumeControl(mn.masterVolume);
      break;
    case "settings":
      IconController.settingsIconDown();
      break;
    case "play":
      console.log("play");
      break;
    case "pause":
      console.log("pause");
      break;
    case "reset":
      console.log("reset");
      break;
  }
}

/**Handles pointer moving events while moving icons */
function handlePointerMove(e: Event) {
  const evt = e as PointerEvent;
  dy = evt.y - currentMousePosition.y;

  if (currentPointer !== evt.pointerId) return;
  IconController.dragIcon(evt, dy);
  switch (activeIcon?.name) {
    case "bpm":
      handleChangeTempo(dy);
      break;
    case "beats":
      handleChangeBeats(dy);
      break;
    case "time-signature":
      console.log("time-signature");
      break;
    case "volume":
      handleChangeVolume(dy);
      // console.log(mn.masterVolume)
      break;
    case "settings":
      console.log("settings");
      break;
    case "play":
      console.log("play");
      break;
    case "pause":
      console.log("pause");
      break;
    case "reset":
      console.log("reset");
      break;
  }
}

/**Handles pointer up events */
function handlePointerUp(e: Event) {
  const evt = e as PointerEvent;
  activeIcon = IconController.getCurrentIcon(evt);

  switch (activeIcon?.name) {
    case "bpm":
      break;
    case "beats":
      console.log("beats up");
      break;
    case "time-signature":
      console.log("time-signature");
      break;
    case "volume":
      SvgDisplayController.displayBpm(mn.tempo);
      break;
    case "settings":
      console.log("settings");
      break;
    case "play":
      console.log("play");
      break;
    case "pause":
      console.log("pause");
      break;
    case "reset":
      console.log("reset");
      break;
  }
  activeIcon?.iconGroup?.releasePointerCapture(evt.pointerId);
  activeIcon?.setHomePosition();
  activeIcon = null;
  currentPointer = null;
  dy = 0;

  // SvgDisplayController.displayBpm(mn.tempo);
  // console.log(mn);
}

export { handlePointerDown, handlePointerUp, handlePointerMove };
