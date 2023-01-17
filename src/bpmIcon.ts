import { Y_OFFSET, X_OFFSET } from "./helpers";

function createBPMIcon(parent: SVGElement) {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const iconPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  parent.append(group);
  const bg = document.querySelector("#bg-circle");

  const coords = bg?.getBoundingClientRect() as DOMRect;

  console.log("bpm", coords);
  const x = coords.width - Y_OFFSET;
  const y = coords.top + coords.height / 2 - X_OFFSET;

  iconPath.setAttribute(
    "d",
    "M20.85 31.05q1.25 1.25 3.175 1.2 1.925-.05 2.825-1.4l11.6-17.25-17.3 11.6q-1.35.9-1.45 2.75-.1 1.85 1.15 3.1ZM9.5 40.7q-1.05 0-2-.5t-1.45-1.45q-1.4-2.45-2.1-5.15-.7-2.7-.7-5.5 0-4.35 1.625-8.125Q6.5 16.2 9.3 13.375q2.8-2.825 6.55-4.475 3.75-1.65 8.05-1.65 4.35 0 8.15 1.65 3.8 1.65 6.65 4.45 2.85 2.8 4.475 6.6 1.625 3.8 1.625 8.15-.05 2.8-.725 5.525-.675 2.725-2.025 5.125-.6.95-1.525 1.45-.925.5-1.975.5Z"
  );
  group.setAttributeNS(null, "transform", `translate(${x}, ${y})`);
  group.setAttribute("id", "set-bpm");
  group.append(iconPath);

  parent.append(group);
}

export { createBPMIcon };
