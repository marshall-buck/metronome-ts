import { Metronome } from "../models/metronome";
import { BOTTOM_CENTER, PadSettings, topPad, SUB_PATH } from "./uiConfig";

class PadController {
  static showSubdivisions = false;
  static padContainer = document.querySelector("#pads");

  /** Draws pads at position 0 , runs every time time signature is changed
   * -Param
   * numPads: number of pads to draw
   */
  static drawPads(mn: Metronome) {
    PadController.clearPads();

    for (
      let i = 0;
      i < mn.timeSig.beats * mn.beatDivisions;
      i = i + mn.beatDivisions
    ) {
      const pad = PadController.drawCircle(topPad);
      pad.setAttribute("data-current-beat", `${i}`);
      if (mn.isPlaying) {
        pad.setAttribute("class", `${i === 0 ? "beat active" : "beat"}`);
      } else {
        pad.setAttribute("class", "beat");
      }

      pad.setAttribute(
        "transform",
        `rotate(${((i / mn.beatDivisions) * 360) / mn.timeSig.beats}, ${
          BOTTOM_CENTER.x
        }, ${BOTTOM_CENTER.y})`
      );

      PadController.padContainer?.append(pad);
      if (PadController.showSubdivisions && mn.beatDivisions > 1) {
        const subs = PadController.drawSubdivisions(
          i,
          ((i / mn.beatDivisions) * 360) / mn.timeSig.beats,
          mn.beatDivisions
        );

        PadController.padContainer?.append(subs);
      }
    }
  }

  /** Clear Pads
   * removes all pad elements from dom
   */
  private static clearPads() {
    const padsArray = Array.from(document.querySelectorAll(".beat"));
    const subdivisions = Array.from(
      document.querySelectorAll(".subdivision-group")
    );
    padsArray.forEach((e) => e.remove());
    subdivisions.forEach((e) => e.remove());
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
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("class", "subdivision top-subdivision beat");
      path.setAttribute("data-current-beat", `${beatNumber + i}`);
      console.log(i);

      path.setAttribute(
        "transform",
        `rotate(${120 * (i - 1)}, ${topPad.cx}, ${topPad.cy})`
      );
      path.setAttribute("d", SUB_PATH);

      const rotateGroup = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );

      rotateGroup.append(path);

      rotateGroup.setAttribute(
        "transform",
        `rotate(${-deg}, ${topPad.cx}, ${topPad.cy})`
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
}
export { PadController };
