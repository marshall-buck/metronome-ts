// import { mn } from "../models/metronome";
// import { HudCtrl } from "./HudCtrl";
// import { Icon } from "./Icon";
// import { IconController } from "./IconController";
// import { PadController } from "./PadController";

// let currentPointer: number | null = null;

// let currentMousePosition = { x: 0, y: 0 };
// let activeIcon: Icon | null;

// let dy = 0;

// /**Handles Pointer down events */
// function handlePointerDown(e: Event) {
//   const evt = e as PointerEvent;

//   currentPointer = evt.pointerId;
//   currentMousePosition.x = evt.x;
//   currentMousePosition.y = evt.y;
//   activeIcon = IconController.getCurrentIcon(evt);

//   activeIcon?.iconGroup?.setPointerCapture(evt.pointerId);

//   switch (activeIcon?.name) {
//     case "division":
//       HudCtrl.showDivisionIndicators(mn.beatDivisions);
//       break;
//     case "time-signature":
//       HudCtrl.showTimeSigIndicators(mn.timeSig.id);
//       break;
//     case "volume":
//       HudCtrl.setVolumeDisplay(mn.masterVolume);
//       break;
//     case "settings":
//       IconController.settingsIconDown();
//       break;
//     case "play":
//       console.log("play");
//       break;
//     case "pause":
//       console.log("pause");
//       break;
//     case "reset":
//       console.log("reset");
//       break;
//   }
// }

// /**Handles pointer moving events while moving icons */
// function handlePointerMove(e: Event) {
//   const evt = e as PointerEvent;
//   dy = evt.y - currentMousePosition.y;
//   if (currentPointer !== evt.pointerId) return;

//   IconController.dragIcon(evt, dy);
//   switch (activeIcon?.name) {
//     case "bpm":
//       handleChangeTempo(dy);
//       break;
//     case "division":
//       handleChangeDivision(dy);
//       break;
//     case "time-signature":
//       handleChangeTimeSig(dy);
//       PadController.drawPads(mn.timeSig.beats);
//       break;
//     case "volume":
//       handleChangeVolume(dy);
//       break;
//   }
// }

// /**Handles pointer up events */
// function handlePointerUp(e: Event) {
//   const evt = e as PointerEvent;
//   activeIcon = IconController.getCurrentIcon(evt);

//   switch (activeIcon?.name) {
//     case "bpm":
//       break;
//     case "division":
//       HudCtrl.hideDivisionIndicator();
//       HudCtrl.displayBpm(mn.bpm);
//       break;
//     case "time-signature":
//       HudCtrl.hideTimeSigIndicator();

//       HudCtrl.displayBpm(mn.bpm);
//       break;
//     case "volume":
//       HudCtrl.displayBpm(mn.bpm);
//       break;
//     case "settings":
//       console.log("settings");
//       break;
//     case "play":
//       console.log("play");
//       break;
//     case "pause":
//       console.log("pause");
//       break;
//     case "reset":
//       console.log("reset");
//       break;
//   }
//   activeIcon?.iconGroup?.releasePointerCapture(evt.pointerId);
//   activeIcon?.setHomePosition();
//   activeIcon = null;
//   currentPointer = null;
//   dy = 0;
// }

// // export { handlePointerDown, handlePointerUp, handlePointerMove };
