import { Metronome } from "../models/metronome";
import { Beat, Subdivision } from "./Pad";
import { BOTTOM_CENTER, topPadPosition, SUBDIVISION_ARC } from "./uiConfig";

class PadController {
  static showSubdivisions = false;
  static padContainer = document.querySelector("#pads");

  static toggleShowSubdivisions(mn: Metronome) {
    PadController.showSubdivisions = !PadController.showSubdivisions;
    PadController.drawPads(mn);
  }

  static Beats: Array<Beat | Subdivision> = [];

  /** Draws all pads at position  , runs every time time signature is changed */

  static drawPads(mn: Metronome) {
    PadController.clearPads();

    if (PadController.showSubdivisions) {
      for (
        let i = 0;
        i < mn.timeSig.beats * mn.beatDivisions;
        i = i + mn.beatDivisions
      ) {
        const rotation = ((i / mn.beatDivisions) * 360) / mn.timeSig.beats;
        const pad = PadController.drawPad(rotation, i, mn.shouldDrawNote());

        PadController.padContainer?.append(pad);

        const subs = PadController.drawSubdivisions(
          i,
          ((i / mn.beatDivisions) * 360) / mn.timeSig.beats,
          mn.beatDivisions
        );

        PadController.padContainer?.append(subs);
      }
    } else {
      for (let i = 0; i < mn.timeSig.beats; i++) {
        const rotation = (i * 360) / mn.timeSig.beats;
        const pad = PadController.drawPad(rotation, i, mn.isPlaying);

        PadController.padContainer?.append(pad);
      }
    }
  }

  /** Clear Pads
   * removes all pad elements from dom
   */
  private static clearPads() {
    const padsArray = Array.from(
      document.querySelectorAll("[data-current-beat]")
    );
    const subdivisions = Array.from(
      document.querySelectorAll(".subdivision-group")
    );
    subdivisions.forEach((e) => e.remove());
    padsArray.forEach((e) => e.remove());
  }

  /** Draws One pad */
  private static drawPad(
    rotation: number,
    currentBeat: number,
    drawNote: boolean | number
  ) {
    const pad = new Beat(currentBeat, topPadPosition);

    if (currentBeat === drawNote) {
      pad.makeActive();
    } else {
      pad.makeInactive();
    }
    pad.rotate(rotation, BOTTOM_CENTER.x, BOTTOM_CENTER.y);

    return pad.node();
  }
  /** Create Subdivisions for a Beat */

  private static drawSubdivisions(
    beatNumber: number,
    deg: number,
    beatDivisions: number
  ) {
    const subdivisionGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    subdivisionGroup.setAttribute("class", "subdivision-group");
    for (let i = 1; i <= beatDivisions - 1; i++) {
      const subdivision = new Subdivision(beatNumber + i);
      subdivision.rotate(
        SUBDIVISION_ARC * (i - 1) - deg,
        topPadPosition.cx,
        topPadPosition.cy
      );

      subdivisionGroup.append(subdivision.node());
    }
    subdivisionGroup.setAttribute(
      "transform",
      `rotate(${deg}, ${BOTTOM_CENTER.x}, ${BOTTOM_CENTER.y})`
    );

    return subdivisionGroup;
  }
}
export { PadController };
