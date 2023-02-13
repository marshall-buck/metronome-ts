// import { beatsIcon } from "./config";
const sigs = ["_3-4", "_4-4", "_5-4", "_6-4", "_6-8", "_7-8", "_9-8", "_12-8"];
class SvgDisplayController {
  /*****BPM */
  /** Set bpm display to current bpm */
  static displayBpm(number: number) {
    const bpmLabel = document.querySelector("#bpm-indicator") as SVGTextElement;
    SvgDisplayController.showElement(bpmLabel);
    bpmLabel.textContent = number.toFixed(0);
  }
  /*****VOLUME */
  /**set display to volume */
  static setVolumeDisplay(number: number) {
    const bpmLabel = document.querySelector("#bpm-indicator") as SVGTextElement;

    bpmLabel.textContent = `${(number * 100).toFixed(0)}%`;
  }

  /**************BEATS */
  static showBeatsIndicators(current: string) {
    SvgDisplayController.hideSvgTextDisplay();
    const beatGroup = document.querySelector("#beat-indicators");
    SvgDisplayController.showElement(beatGroup as Element);

    const beatIndicators = Array.from(
      document.querySelectorAll(".beat-indicator")
    );

    const currentElement = beatIndicators.find((e) => e.id.startsWith(current));

    currentElement?.classList.toggle("show");
    currentElement?.classList.toggle("hide");
  }
  static changeBeatsIndicator(current: string) {
    const beatIndicators = Array.from(
      document.querySelectorAll(".beat-indicator")
    );
    const currentElement = beatIndicators.find((e) => e.id.startsWith(current));

    console.log(currentElement?.id);
    beatIndicators.forEach((ele) => {
      if (ele.id === currentElement?.id) {
        SvgDisplayController.showElement(currentElement);
      } else {
        SvgDisplayController.hideElement(ele);
      }
    });
  }

  static hideBeatsIndicator() {
    const beatIndicators = Array.from(
      document.querySelectorAll(".beat-indicator")
    );
    beatIndicators.forEach((ele) => {
      SvgDisplayController.hideElement(ele);
    });
  }

  /*****TIME SIGNATURES */
  static showTimeSigIndicators(index: number) {
    SvgDisplayController.hideSvgTextDisplay();
    const timeSigGroup = document.querySelector("#time-signature-indicators");
    SvgDisplayController.showElement(timeSigGroup as Element);

    const timeSigIndicatorArray = Array.from(
      document.querySelectorAll(".time-signature-indicator")
    );

    const currentElement = timeSigIndicatorArray[index];

    currentElement?.classList.toggle("show");
    currentElement?.classList.toggle("hide");
  }

  static changeTimeSigIndicator(index: number) {
    const timeSigIndicatorArray = Array.from(
      document.querySelectorAll(".time-signature-indicator")
    );
    const currentElement = timeSigIndicatorArray[index];

    console.log(currentElement?.id);
    timeSigIndicatorArray.forEach((ele) => {
      if (ele.id === currentElement?.id) {
        SvgDisplayController.showElement(currentElement);
      } else {
        SvgDisplayController.hideElement(ele);
      }
    });
  }

  static hideTimeSigIndicator() {
    const timeSigIndicatorArray = Array.from(
      document.querySelectorAll(".time-signature-indicator")
    );
    timeSigIndicatorArray.forEach((ele) => {
      SvgDisplayController.hideElement(ele);
    });
  }

  /****HELPERS */
  static hideSvgTextDisplay() {
    const bpmLabel = document.querySelector("#bpm-indicator") as SVGTextElement;
    // bpmLabel.textContent = "";
    SvgDisplayController.hideElement(bpmLabel);
  }
  /** Hides an element */
  static hideElement(element: Element) {
    element?.classList.remove("show");
    element?.classList.add("hide");
  }

  /** Shows an element */
  static showElement(element: Element) {
    element?.classList.remove("hide");
    element?.classList.add("show");
  }
}
export { SvgDisplayController };
1;
