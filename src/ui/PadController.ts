import { toSVGPoint } from "../helpers";
import { mn } from "../models/metronome";
import {
  BOTTOM_CENTER,
  PadSettings,
  subDivisionRadius,
  topPad,
  subDivisionOffset,
  TOP_CENTER,
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
    padsArray.forEach((e) => e.remove());

    for (let i = 0; i < numPads; i++) {
      const circle = PadController.drawCircle(topPad);
      if (mn.isPlaying) {
        circle.setAttribute("class", `${i === 0 ? "beat active" : "beat"}`);
      } else {
        circle.setAttribute("class", "beat");
      }

      circle.setAttribute(
        "transform",
        `rotate(${(i * 360) / mn.timeSig.beats}, ${BOTTOM_CENTER.x}, ${
          BOTTOM_CENTER.y
        })`
      );

      PadController.padContainer?.append(circle);
    }
    const pads = Array.from(
      document.querySelectorAll(".beat")
    ) as SVGGraphicsElement[];
    this.drawSubdivisions(pads);
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

  static drawSubdivisions(pads: SVGGraphicsElement[]) {
    pads.forEach((e) => {
      const circle = e as SVGCircleElement;

      console.log(
        toSVGPoint(
          e,
          Number(circle.getAttribute("cx")),
          Number(circle.getAttribute("cy"))
        )
      );
    });
  }
}
export { PadController };
