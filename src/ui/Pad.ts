import { SUB_PATH, topPadPosition } from "./uiConfig";
/**Base class for a pad- */
class Indicator {
  currentBeat: number;
  isBar?: boolean;
  isBeat?: boolean;
  isSub?: boolean;
  element: SVGCircleElement | SVGPathElement;
  constructor(currentBeat: number, element: SVGCircleElement | SVGPathElement) {
    this.currentBeat = currentBeat;
    this.element = element;
  }

  show(element: Element) {
    element.classList.remove("hide");
  }
  hide(element: Element) {
    element.classList.add("hide");
  }
  makeActive(element: Element) {
    element.setAttribute("class", "active beat");
  }
  makeInactive(element: Element) {
    element.setAttribute("class", "beat");
  }
  rotate(element: Element, rotation: number, x: number, y: number) {
    element.setAttribute("transform", `rotate(${rotation}, ${x}, ${y})`);
  }
}

class Pad {
  beat: SVGCircleElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  subDivision: SVGPathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  currentBeat: number;

  constructor(currentBeat: number) {
    this.beat.setAttribute("r", topPadPosition.r);
    this.beat.setAttribute("cx", topPadPosition.cx);
    this.beat.setAttribute("cy", topPadPosition.cy);
    this.beat.setAttribute("data-current-beat", `${currentBeat}`);
    this.subDivision.setAttribute("class", "beat hide");
    this.subDivision.setAttribute("data-current-beat", `${currentBeat}`);
    this.subDivision.setAttribute("d", SUB_PATH);
    this.currentBeat = currentBeat;
  }

  // /** private function to draw a circle */
  // private static drawCircle(defaultAttrs: PadSettings): SVGCircleElement {
  //   const circle = document.createElementNS(
  //     "http://www.w3.org/2000/svg",
  //     "circle"
  //   );

  //   circle.setAttribute("r", defaultAttrs.r);
  //   circle.setAttribute("cx", defaultAttrs.cx);
  //   circle.setAttribute("cy", defaultAttrs.cy);

  //   return circle;
  // }
}
