class SvgDisplayController {
  static displayBpm(number: number) {
    const bpmLabel = document.querySelector("#bpm-indicator") as SVGTextElement;
    bpmLabel.textContent = number.toFixed(0);
  }
  static displayVolumeControl(number: number) {
    const bpmLabel = document.querySelector("#bpm-indicator") as SVGTextElement;

    bpmLabel.textContent = `${(number * 100).toFixed(0)}%`;
  }
}
export { SvgDisplayController };
