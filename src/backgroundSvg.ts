import { getCenter, portOrLand } from "./helpers";

function createBgSvg() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const iconCircle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const center = getCenter(window.innerWidth, window.innerHeight);
  const radius =
    portOrLand() === "portrait"
      ? window.innerWidth / 2
      : window.innerHeight / 2;
  const width = window.innerWidth.toString();
  const height = window.innerHeight.toString();

  svg.setAttribute("width", `${width}`);
  svg.setAttribute("height", `${height}`);
  svg.setAttribute("id", "bg");

  iconCircle.setAttribute("fill", "grey");
  iconCircle.setAttribute("cx", `${center.x}`);
  iconCircle.setAttribute("cy", `${center.y}`);
  iconCircle.setAttribute("r", `${radius}`);
  iconCircle.setAttribute("id", "bg-circle");

  group.setAttribute("id", "rotate-circle");
  group.append(iconCircle);
  svg.appendChild(group);
  return svg;
}
export { createBgSvg };
