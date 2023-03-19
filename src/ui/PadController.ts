import { Metronome } from "../models/metronome";
import { Beat, Pad, Subdivision } from "./Pad";
import { BOTTOM_CENTER, topPadPosition, SUBDIVISION_ARC } from "./uiConfig";

/** Class to handle the display of Pads on the metronome */
class PadController {
  static showSubdivisions = false;
  static padContainer = document.querySelector("#pads");
  static pads: Pad[] = [];

  /** Toggles when to show subdivisions */
  static toggleShowSubdivisions(mn: Metronome) {
    PadController.showSubdivisions = !PadController.showSubdivisions;
    PadController.drawPads(mn);
  }

  /** Handles the clearing and appending the beats and subdivisions to the dom */
  static drawPads(mn: Metronome) {
    PadController.clearPadsFromDom();
    PadController.clearPadsArray();

    if (PadController.showSubdivisions) {
      PadController.appendPadsWithSubdivisions(mn);
    } else {
      PadController.appendPadsWithoutSubdivisions(mn);
    }
  }

  /** Appends Beats with subdivisions to the DOM */
  private static appendPadsWithSubdivisions(mn: Metronome) {
    for (
      let i = 0;
      i < mn.timeSig.beats * mn.beatDivisions;
      i = i + mn.beatDivisions
    ) {
      const rotation = ((i / mn.beatDivisions) * 360) / mn.timeSig.beats;
      const beat = PadController.createBeat(rotation, i, mn.shouldDrawNote());

      PadController.padContainer?.append(beat.node());

      const subdivisions = PadController.createSubdivisions(
        i,
        rotation,
        mn.beatDivisions
      );
      const subdivisionGroup = PadController.createSubdivisionGroup(
        subdivisions,
        rotation
      );
      PadController.padContainer?.append(subdivisionGroup);
    }
  }

  /** Appends Beats without subdivisions to the DOM */
  private static appendPadsWithoutSubdivisions(mn: Metronome) {
    for (let i = 0; i < mn.timeSig.beats; i++) {
      const rotation = (i * 360) / mn.timeSig.beats;
      const pad = PadController.createBeat(rotation, i, mn.isPlaying);

      PadController.padContainer?.append(pad.node());
    }
  }

  /** Clear Pads
   * removes all pad elements from dom
   */
  private static clearPadsFromDom() {
    const padsArray = Array.from(
      document.querySelectorAll("[data-current-beat]")
    );
    const subdivisions = Array.from(
      document.querySelectorAll(".subdivision-group")
    );
    subdivisions.forEach((e) => e.remove());
    padsArray.forEach((e) => e.remove());
  }

  private static clearPadsArray() {
    PadController.pads.length = 0;
  }

  /** Creates One Beat, adds beat to pads array */
  private static createBeat(
    rotation: number,
    currentBeat: number,
    drawNote: boolean | number
  ): Beat {
    const beat = new Beat(currentBeat, topPadPosition);

    if (currentBeat === drawNote) {
      beat.makeActive();
    } else {
      beat.makeInactive();
    }
    beat.rotate(rotation, BOTTOM_CENTER.x, BOTTOM_CENTER.y);
    PadController.pads.push(beat);
    return beat;
  }

  /** Creates array of Subdivision Nodes to add to a Beat,
   * adds subdivision to pads array*/
  private static createSubdivisions(
    beatNumber: number,
    deg: number,
    beatDivisions: number
  ): Node[] {
    const subdivisions = [];
    for (let i = 1; i <= beatDivisions - 1; i++) {
      const subdivision = new Subdivision(beatNumber + i);
      subdivision.rotate(
        SUBDIVISION_ARC * (i - 1) - deg,
        topPadPosition.cx,
        topPadPosition.cy
      );
      subdivisions.push(subdivision.node());
      PadController.pads.push(subdivision);
    }

    return subdivisions;
  }

  /** Creates the Subdivision Group to append to svg */
  private static createSubdivisionGroup(subdivisions: Node[], deg: number) {
    const subdivisionGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    subdivisionGroup.setAttribute("class", "subdivision-group");
    subdivisionGroup.setAttribute(
      "transform",
      `rotate(${deg}, ${BOTTOM_CENTER.x}, ${BOTTOM_CENTER.y})`
    );

    subdivisionGroup.append(...subdivisions);
    return subdivisionGroup;
  }
}
export { PadController };
