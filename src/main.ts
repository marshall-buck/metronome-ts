import "./style.css";

import { Icon } from "./ui/Icon";
import { clamp, convertMouseMovementToNumber } from "./helpers";

import { IconController } from "./ui/IconController";
import { mn } from "./models/metronome";
import { PadController } from "./ui/PadController";
import { HudCtrl } from "./ui/HudCtrl";
PadController.drawPads(mn.timeSig.beats);

let anF: number;
let currentPointer: number | null = null;

let currentMousePosition = { x: 0, y: 0 };
let activeIcon: Icon | null;

let dy = 0;
/************MOVE HANDLERS *****************************/
/** Handler to change Tempo based on  pointermove*/
function handleChangeTempo(dy: number) {
  const mod = 0.5;
  const modifier = dy <= 0 ? mn.bpm + mod : mn.bpm - mod;
  mn.bpm = clamp(modifier, 20, 180);
  HudCtrl.displayBpm(mn.bpm);
}

/**Handles change in Volume pointermove */
function handleChangeVolume(dy: number) {
  const mod = -0.00003;

  const newVol = clamp(mn.masterVolume + dy * mod, 0.001, 1);

  HudCtrl.setVolumeDisplay(newVol);

  mn.masterVolume = newVol;
}
/**Handles change in divisions, for pointermove */
function handleChangeDivision(dy: number) {
  const number = convertMouseMovementToNumber(dy, -90, 90, 0.5);
  const beatMods: number[] = [1, 2, 3, 4];
  const numberDivisor = 32;
  let index: number;

  if (dy > 0) {
    index = clamp(Math.floor(number / numberDivisor), -2, 0) + 2;
  } else {
    index = clamp(Math.floor(number / numberDivisor), 0, 2) + 1;
  }

  HudCtrl.changeDivisionIndicator(mn.beatDivisions);
  mn.beatDivisions = beatMods[index];
}
/**handles time sig change  for pointermove */
function handleChangeTimeSig(dy: number) {
  const number = convertMouseMovementToNumber(dy, -90, 90, 0.5);
  const numberDivisor = 16;
  let index: number;
  if (dy > 0) {
    index = clamp(Math.floor(number / numberDivisor), -4, 0) + 4;
  } else {
    index = clamp(Math.floor(number / numberDivisor), 0, 5) + 4;
  }
  HudCtrl.changeTimeSigIndicator(index);
}

/** Handles starting/Stopping metronome */
async function handleStart() {
  if (mn.isPlaying) return; // disable is playing

  await mn.start();
  anF = requestAnimationFrame(animatePads);
}

/** Handles starting/Stopping metronome */
async function handlePause() {
  if (!mn.isPlaying) return; // disable if !is playing
  await mn.pause();
  cancelAnimationFrame(anF);
}

async function handleReset() {
  await mn.reset();
  PadController.drawPads(mn.timeSig.beats);
  cancelAnimationFrame(anF);
}

/******************* DRAW PADS CONTROL *****************************/
/** function to update the UI, so we can see when the beat progress.
 This is a loop: it reschedules itself to redraw at the end. */
function animatePads() {
  const drawNote = mn.shouldDrawNote();
  const pads = document.querySelectorAll(".beat");

  if (drawNote !== false) {
    // If Show divisions is unchecked then only draw beats
    if (!PadController.showSubdivisions) {
      pads.forEach((pad, idx) => {
        if (idx === (drawNote as number) / mn.beatDivisions) {
          pad.classList.add("active");
        } else pad.classList.remove("active");
      });
    } else {
      pads.forEach((pad, idx) => {
        if (idx === drawNote) {
          pad.classList.add("active");
        } else pad.classList.remove("active");
      });
    }
  }
  // if (drawNote !== false) {
  //   pads.forEach((pad, idx) => {
  //     //  To highlight beat every n beats drawNote/ n
  //     // idx === drawNote / 2 will act like eight notes, must
  //     //  also set time sig beats to 8

  //     if (idx === (drawNote as number) / mn.beatDivisions) {
  //       pad.classList.toggle("active");
  //     } else pad.setAttribute("class", "beat");
  //   });
  // }
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
    case "division":
      HudCtrl.showDivisionIndicators(mn.beatDivisions);
      break;
    case "subdivision":
      console.log("subdivision");
      PadController.showSubdivisions = !PadController.showSubdivisions;

      break;
    case "time-signature":
      HudCtrl.showTimeSigIndicators(mn.timeSig.id);
      break;
    case "volume":
      HudCtrl.setVolumeDisplay(mn.masterVolume);
      break;
    case "settings":
      // IconController.settingsIconDown();
      console.log("settings");

      break;
    case "play":
      handleStart();
      console.log("play");
      break;
    case "pause":
      console.log("pause");
      handlePause();
      break;
    case "reset":
      console.log("reset");
      handleReset();
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
    case "division":
      handleChangeDivision(dy);
      break;
    case "time-signature":
      handleChangeTimeSig(dy);
      PadController.drawPads(mn.timeSig.beats);
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
    case "division":
      HudCtrl.hideDivisionIndicator();
      HudCtrl.displayBpm(mn.bpm);
      break;
    case "time-signature":
      HudCtrl.hideTimeSigIndicator();

      HudCtrl.displayBpm(mn.bpm);
      break;
    case "volume":
      HudCtrl.displayBpm(mn.bpm);
      break;
    case "settings":
      console.log("settings");
      break;
  }
  activeIcon?.iconGroup?.releasePointerCapture(evt.pointerId);
  activeIcon?.setHomePosition();
  activeIcon = null;
  currentPointer = null;
  dy = 0;
}

export { handlePointerDown, handlePointerUp, handlePointerMove };
