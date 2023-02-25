import { mn } from "../models/metronome";
import {
  BOTTOM_CENTER,
  PadSettings,
  topPad,
  SUB_1,
  SUB_2,
  SUB_3,
} from "./uiConfig";

class PadController {
  static showSubdivisions = false;
  static padContainer = document.querySelector("#pads");

  /** Draws pads at position 0 , runs every time time signature is changed
   * -Param
   * numPads: number of pads to draw
   */
  static drawPads(numPads: number) {
    const padsArray = Array.from(document.querySelectorAll(".beat"));
    const subdivisions = Array.from(
      document.querySelectorAll(".subdivision-group")
    );
    padsArray.forEach((e) => e.remove());
    subdivisions.forEach((e) => e.remove());

    for (let i = 0; i < numPads; i++) {
      const pad = PadController.drawCircle(topPad);
      if (mn.isPlaying) {
        pad.setAttribute("class", `${i === 0 ? "beat active" : "beat"}`);
      } else {
        pad.setAttribute("class", "beat");
      }

      pad.setAttribute(
        "transform",
        `rotate(${(i * 360) / mn.timeSig.beats}, ${BOTTOM_CENTER.x}, ${
          BOTTOM_CENTER.y
        })`
      );

      PadController.padContainer?.append(pad);
      const subs = PadController.drawSubdivisions(i * 360);

      PadController.padContainer?.append(subs);
    }
  }
  /** private function to draw a circle */
  private static drawCircle(settings: PadSettings): SVGCircleElement {
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    circle.setAttribute("r", settings.r);
    circle.setAttribute("cx", settings.cx);
    circle.setAttribute("cy", settings.cy);

    return circle;
  }

  static drawSubdivisions(deg: number) {
    const subdivisionGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    subdivisionGroup.setAttribute("class", "subdivision-group");
    const sub1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    sub1.setAttribute("class", "subdivision top-subdivision");
    sub1.setAttribute("d", SUB_1);

    const sub2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    sub2.setAttribute("class", "subdivision top-subdivision");
    sub2.setAttribute("d", SUB_2);

    const sub3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    sub3.setAttribute("class", "subdivision top-subdivision");
    sub3.setAttribute("d", SUB_3);

    const rotateGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );

    subdivisionGroup.setAttribute(
      "transform",
      `rotate(${deg / mn.timeSig.beats}, ${BOTTOM_CENTER.x}, ${
        BOTTOM_CENTER.y
      })`
    );
    subdivisionGroup.append(rotateGroup);
    rotateGroup.append(sub1, sub2, sub3);

    rotateGroup.setAttribute(
      "transform",
      `rotate(${-deg / mn.timeSig.beats}, ${topPad.cx}, ${topPad.cy})`
    );
    return subdivisionGroup;
  }
}
export { PadController };
