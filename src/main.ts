import "./style.css";

import { Icon } from "./Icon";
import { clamp, convertMouseMovementToNumber, isBetween } from "./helpers";

import { IconController } from "./IconController";
import { mn } from "./metronomeModel/metronome";
import { PadController } from "./PadController";
import { SvgDisplayController } from "./SvgDisplayController";
PadController.drawPads(mn.timeSig.beats);

let anF;
let currentPointer: number | null = null;

let currentMousePosition = { x: 0, y: 0 };
let activeIcon: Icon | null;

let dy = 0;

/** Handler to change Tempo based on mouse movement  pointermove*/
function handleChangeTempo(dy: number) {
  const mod = 0.1;
  const modifier = dy <= 0 ? mn.tempo + mod : mn.tempo - mod;
  mn.tempo = clamp(modifier, 20, 180);
  SvgDisplayController.displayBpm(mn.tempo);
}

/**Handles change in Volume pointermove */
function handleChangeVolume(dy: number) {
  const mod = -0.00005;
  const newVol = clamp(mn.masterVolume + dy * mod, 0.001, 1);

  SvgDisplayController.setVolumeDisplay(newVol);

  mn.masterVolume = newVol;
}
/**Handles change in beats, for pointermove */
function handleChangeBeats(dy: number) {
  const number = convertMouseMovementToNumber(dy, -90, 90, 0.5);
  const beatMods: string[] = ["sixteenth", "trips", "eight", "quarter"];
  const numberDivisor = 32;
  let index: number;

  if (dy > 0) {
    console.log(clamp(Math.floor(number / numberDivisor), -2, 0) + 2);
    index = clamp(Math.floor(number / numberDivisor), -2, 0) + 2;
  } else {
    console.log(clamp(Math.floor(number / numberDivisor), 0, 2) + 1);
    index = clamp(Math.floor(number / numberDivisor), 0, 2) + 1;
  }

  SvgDisplayController.changeBeatsIndicator(beatMods[index]);
  mn.beatsToPlay(beatMods[index]);
}
/**handles time sig change */
function handleChangeTimeSig(dy: number) {
  const number = convertMouseMovementToNumber(dy, -90, 90, 0.5);
  const numberDivisor = 16;
  let index: number;
  if (dy > 0) {
    index = clamp(Math.floor(number / numberDivisor), -3, 0) + 3;
  } else {
    index = clamp(Math.floor(number / numberDivisor), 0, 4) + 3;
  }
  mn.timeSig = index.toString();
  SvgDisplayController.changeTimeSigIndicator(index);
  //
}

/** return number of pads to draw */
// function numberOfPads(beats: string): number {
//   mn.timeSig = beats;
//   return mn.timeSig.beats;
// }

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
  // console.log(activeIcon);
  // TODO:get current beats for pointer down beats
  switch (activeIcon?.name) {
    case "beats":
      SvgDisplayController.showBeatsIndicators("quarter");
      break;
    case "time-signature":
      SvgDisplayController.showTimeSigIndicators(mn.timeSig.beats);
      break;
    case "volume":
      console.log("from click handler", mn.masterVolume);
      SvgDisplayController.setVolumeDisplay(mn.masterVolume);
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
      handleChangeTimeSig(dy);
      break;
    case "volume":
      handleChangeVolume(dy);
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
      SvgDisplayController.hideBeatsIndicator();
      SvgDisplayController.displayBpm(mn.tempo);
      break;
    case "time-signature":
      SvgDisplayController.hideTimeSigIndicator();
      PadController.drawPads(mn.timeSig.beats);
      SvgDisplayController.displayBpm(mn.tempo);
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
}

export { handlePointerDown, handlePointerUp, handlePointerMove };
