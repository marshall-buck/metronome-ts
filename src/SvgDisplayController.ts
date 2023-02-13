class SvgDisplayController {
  static displayBpm(number: number) {
    const bpmLabel = document.querySelector("#bpm-indicator") as SVGTextElement;
    bpmLabel.textContent = number.toFixed(0);
  }
  static displayVolumeControl(number: number) {
    const bpmLabel = document.querySelector("#bpm-indicator") as SVGTextElement;

    bpmLabel.textContent = `${(number * 100).toFixed(0)}%`;
  }
  static displayBeatsControlDown(current: string) {
    const bpmLabel = document.querySelector("#bpm-indicator") as SVGTextElement;

    bpmLabel.classList.toggle("hide");
    const beatIndicators = Array.from(
      document.querySelectorAll(".beat-indicator")
    );
    const currentElement = beatIndicators.find((e) => e.id.startsWith(current));

    currentElement?.classList.toggle("show");
    currentElement?.classList.toggle("hide");
  }
  static displayBeatsControlMove(current: string) {
    const beatIndicators = Array.from(
      document.querySelectorAll(".beat-indicator")
    );
    const currentElement = beatIndicators.find((e) => e.id.startsWith(current));

    console.log(currentElement?.id);
    beatIndicators.forEach((ele) => {
      if (ele.id === currentElement?.id) {
        console.log("show", currentElement.id);
        currentElement.classList.remove("hide");
        currentElement.classList.add("show");
      } else {
        ele.classList.remove("show");
        ele.classList.add("hide");
      }
    });
  }

  static displayBeatsControlDeselect(index: number) {
    return index;
  }
}
export { SvgDisplayController };
