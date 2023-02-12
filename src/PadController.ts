import { BOTTOM_CENTER, PADS, PadSettings } from "./config";

class PadController {
  /** Draws pads at position 0 , runs every time time signature is changed
   * -Param
   * numPads: number
   */
  static drawInitialPads(numPads: number) {
    const padContainer = document.querySelector("#pads");
    const settings = PADS[numPads.toString()];
    let deg = settings.deg;

    for (let i = 0; i < numPads; i++) {
      const circle = PadController.drawCircle(settings);
      circle.setAttribute("class", `${i === 0 ? "beat active" : "beat"}`);

      // if (i !== 0) {
      //   console.log(i * deg);

      //   const startRotate = `rotate(0 ${BOTTOM_CENTER.x} ${BOTTOM_CENTER.y})`;
      //   const endRotate = `rotate(${i * deg} ${BOTTOM_CENTER.x} ${
      //     BOTTOM_CENTER.y
      //   })`;
      //   const rotateAnimation = [
      //     { SVGTransform: `rotate(0 ${BOTTOM_CENTER.x} ${BOTTOM_CENTER.y})` },

      //     {
      //       SVGTransform: `rotate(${i * deg} ${BOTTOM_CENTER.x} ${
      //         BOTTOM_CENTER.y
      //       })`,
      //     },
      //   ];
      //   const rotateTiming: KeyframeAnimationOptions = {
      //     duration: 2000,
      //     iterations: 1,
      //     fill: "forwards",
      //   };
      //   circle.animate(rotateAnimation, rotateTiming);
      // }

      circle.setAttribute(
        "transform",
        `rotate(${i * deg}, ${BOTTOM_CENTER.x}, ${BOTTOM_CENTER.y})`
      );
      padContainer?.append(circle);
    }
  }
  // /** Animate pads from position 0, to correct location,
  //  * runs every time time signature is changed */
  // private static animatePads(settings: PadSettings) {
  //   const pads = document.querySelectorAll(".beat");

  //   const deg = settings.deg;
  //   console.log(pads);
  // }
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
