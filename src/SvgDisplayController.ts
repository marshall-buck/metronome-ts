/** Helper class to dynamically display information  */
class SvgDisplayController {
  /**Dom Elements */
  static bpmLabel = document.querySelector("#bpm-indicator") as SVGTextElement;
  static divisions = document.querySelector(
    "#division-indicators"
  ) as SVGGElement;
  static divisionText = document.querySelector(
    "#division-text"
  ) as SVGTextElement;

  /*****BPM */

  /** Set bpm display to current bpm */
  static displayBpm(number: number) {
    SvgDisplayController.showElement(SvgDisplayController.bpmLabel);
    SvgDisplayController.bpmLabel.textContent = number.toFixed(0);
  }
  /*****VOLUME */
  /**set display to volume */
  static setVolumeDisplay(number: number) {
    SvgDisplayController.bpmLabel.textContent = `${(number * 100).toFixed(0)}%`;
  }

  /**************DIVISIONS */
  static showDivisionIndicators(division: number) {
    SvgDisplayController.hideSvgTextDisplay();
    SvgDisplayController.divisionText.textContent = division.toString();
    SvgDisplayController.showElement(SvgDisplayController.divisions);
  }
  static changeDivisionIndicator(current: number) {
    SvgDisplayController.divisionText.textContent = current.toString();
  }

  static hideDivisionIndicator() {
    SvgDisplayController.divisions.classList.toggle("show");
    SvgDisplayController.divisions.classList.toggle("hide");
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
