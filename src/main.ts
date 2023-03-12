import "./style.css";

import { Icon } from "./ui/Icon";
import { clamp, convertMouseMovementToNumber } from "./helpers";

import { IconController } from "./ui/IconController";
import { mn } from "./models/metronome";
import { PadController } from "./ui/PadController";
import { HudCtrl } from "./ui/HudCtrl";
import { TIME_SIGS } from "./models/metronomeConfig";
PadController.drawPads(mn);
HudCtrl.showTimeSigIndicators(mn.timeSig.id);
HudCtrl.bpmLabel.textContent = mn.bpm.toString();

// const pads = document.querySelectorAll(".beat") as NodeListOf<SVGElement>;
// pads.forEach((e) => console.log(e.dataset.currentBeat));

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
  if (PadController.showSubdivisions) {
    PadController.drawPads(mn);
  }
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
  const timeSig = Object.keys(TIME_SIGS)[index];

  mn.timeSig = TIME_SIGS[timeSig];
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
  PadController.drawPads(mn);
  cancelAnimationFrame(anF);
}

/******************* DRAW PADS CONTROL *****************************/
/** function to update the UI, so we can see when the beat progress.
 This is a loop: it reschedules itself to redraw at the end. */
function animatePads() {
  const drawNote = mn.shouldDrawNote();
  // const pads = document.querySelectorAll(".beat");
  const pads = document.querySelectorAll("[data-current-beat]");

  if (drawNote !== false) {
    // If Show divisions is unchecked then only draw beats

    pads.forEach((pad) => {
      const ele = pad as HTMLElement;
      const data = Number(ele.dataset.currentBeat);
      if (!PadController.showSubdivisions) {
        if (data === (drawNote as number) / mn.beatDivisions) {
          pad.classList.add("active");
        } else pad.classList.remove("active");
      } else {
        if (data === drawNote) {
          pad.classList.add("active");
        } else pad.classList.remove("active");
      }
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
    case "division":
      HudCtrl.showDivisionIndicators(mn.beatDivisions);
      break;
    case "subdivision":
      console.log("subdivision");
      PadController.toggleShowSubdivisions(mn);

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
      PadController.drawPads(mn);
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
