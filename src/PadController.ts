import { BOTTOM_CENTER, PADS, PadSettings } from "./config";

class PadController {
  /** Draws pads at position 0 , runs every time time signature is changed
   * -Param
   * numPads: number
   */
  static drawPads(numPads: number) {
    const padContainer = document.querySelector("#pads");
    const padsArray = Array.from(document.querySelectorAll(".beat"));
    padsArray.forEach((e) => e.remove());

    padContainer?.childNodes.forEach((e) => e.remove);
    const settings = PADS[numPads.toString()];
    let deg = settings.deg;

    for (let i = 0; i < numPads; i++) {
      const circle = PadController.drawCircle(settings);
      circle.setAttribute("class", `${i === 0 ? "beat active" : "beat"}`);

      circle.setAttribute(
        "transform",
        `rotate(${i * deg}, ${BOTTOM_CENTER.x}, ${BOTTOM_CENTER.y})`
      );
      padContainer?.append(circle);
    }
  }

  static drawCircle(settings: PadSettings) {
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    circle.setAttribute("r", settings.r);
    circle.setAttribute("cx", settings.cx);
    circle.setAttribute("cy", settings.cy);

    return circle;
  }
}
export { PadController };
