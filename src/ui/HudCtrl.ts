/** Helper class to dynamically display information  */
class HudCtrl {
  /**Dom Elements */
  static bpmLabel = document.querySelector("#bpm-indicator") as SVGTextElement;
  static divisions = document.querySelector(
    "#division-indicators"
  ) as SVGGElement;
  static divisionText = document.querySelector(
    "#division-text"
  ) as SVGTextElement;

  static timeSigGroup = document.querySelector(
    "#time-signature-indicators"
  ) as SVGGElement;

  static timeSigIndicatorArray = Array.from(
    document.querySelectorAll(".time-signature-indicator")
  );

  /*****BPM */

  /** Set bpm display to current bpm */
  static displayBpm(number: number) {
    HudCtrl.showElement(HudCtrl.bpmLabel);
    HudCtrl.bpmLabel.textContent = number.toFixed(0);
  }
  /*****VOLUME */
  /**set display to volume */
  static setVolumeDisplay(number: number) {
    HudCtrl.bpmLabel.textContent = `${(number * 100).toFixed(0)}%`;
  }

  /**************DIVISIONS */
  static showDivisionIndicators(division: number) {
    HudCtrl.hideBPMText();
    HudCtrl.divisionText.textContent = division.toString();
    HudCtrl.showElement(HudCtrl.divisions);
  }
  static changeDivisionIndicator(current: number) {
    HudCtrl.divisionText.textContent = current.toString();
  }

  static hideDivisionIndicator() {
    HudCtrl.divisions.classList.toggle("show");
    HudCtrl.divisions.classList.toggle("hide");
  }

  /*****TIME SIGNATURES */
  static showTimeSigIndicators(id: string) {
    const currentTimeSig = document.querySelector(`#${id}`) as Element;

    HudCtrl.showElement(currentTimeSig);
  }

  static changeTimeSigIndicator(index: number) {
    const currentElement = HudCtrl.timeSigIndicatorArray[index];

    HudCtrl.timeSigIndicatorArray.forEach((ele) => {
      if (ele.id === currentElement?.id) {
        HudCtrl.showElement(currentElement);
      } else {
        HudCtrl.hideElement(ele);
      }
    });
  }

  /****HELPERS ********************/
  static hideBPMText() {
    const bpmLabel = document.querySelector("#bpm-indicator") as SVGTextElement;

    HudCtrl.hideElement(bpmLabel);
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
export { HudCtrl };
