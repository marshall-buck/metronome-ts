import { Metronome } from "../models/metronome";
import {
  BOTTOM_CENTER,
  PadSettings,
  topPadPosition,
  SUB_PATH,
} from "./uiConfig";
// BUG: When toggling showSubdivisions, pads always redraw with beat 0 active
class PadController {
  static showSubdivisions = false;
  static padContainer = document.querySelector("#pads");

  static toggleShowSubdivisions(mn: Metronome) {
    PadController.showSubdivisions = !PadController.showSubdivisions;
    PadController.drawPads(mn);
  }

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
        const pad = PadController.drawPad(rotation, i, mn.isPlaying);

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

  /** private function to draw a circle */
  private static drawCircle(defaultAttrs: PadSettings): SVGCircleElement {
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    circle.setAttribute("r", defaultAttrs.r);
    circle.setAttribute("cx", defaultAttrs.cx);
    circle.setAttribute("cy", defaultAttrs.cy);

    return circle;
  }
  /** Draws One pad */
  private static drawPad(rotation: number, i: number, isPlaying: boolean) {
    const pad = PadController.drawCircle(topPadPosition);
    pad.setAttribute("data-current-beat", `${i}`);
    if (isPlaying) {
      pad.setAttribute("class", `${i === 0 ? "beat active" : "beat"}`);
    } else {
      pad.setAttribute("class", "beat");
    }

    pad.setAttribute(
      "transform",
      `rotate(${rotation}, ${BOTTOM_CENTER.x}, ${BOTTOM_CENTER.y})`
    );

    return pad;
  }
  /** Create one Subdivision Indicator */

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
      const path = PadController.createSubPath(beatNumber + i);

      path.setAttribute(
        "transform",
        `rotate(${120 * (i - 1)}, ${topPadPosition.cx}, ${topPadPosition.cy})`
      );
      // path.setAttribute("d", SUB_PATH);

      const rotateGroup = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );

      rotateGroup.append(path);

      rotateGroup.setAttribute(
        "transform",
        `rotate(${-deg}, ${topPadPosition.cx}, ${topPadPosition.cy})`
      );
      rotateGroup.append(path);
      subdivisionGroup.append(rotateGroup);
    }
    subdivisionGroup.setAttribute(
      "transform",
      `rotate(${deg}, ${BOTTOM_CENTER.x}, ${BOTTOM_CENTER.y})`
    );

    return subdivisionGroup;
  }

  static createSubPath(beatNumber: number) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "beat hide");
    path.setAttribute("data-current-beat", `${beatNumber}`);
    path.setAttribute("d", SUB_PATH);

    return path;
  }
}
export { PadController };
