/** retuns the background div */

// let lastDegree=0 //degree when mousedown ended
// let currentDegree=0  //current degree as mouse moves
// const bg = document.createElement("div");
// let startDragDegree;

function returnBgDiv() {
  const root = document.querySelector("#app");
  const bg = document.createElement("div");

  const center = getCenter();
  const aspect = portOrLand(center.x, center.y);
  bg.id = "background";
  bg.className = aspect === "landscape" ? "bg-land" : "bg-port";
  root?.append(bg);
}

function createIcons() {
  const bg = document.querySelector("#background") as HTMLDivElement;

  const box = bg.getBoundingClientRect();

  const center = getCenter();
  console.log(box, center);

  const settings = document.createElement("div");
  settings.id = "settings";
  const settingsCord = {
    top: box.top + box.height - 48,
    left: box.left + box.width / 2 - 24,
  };
  settings.setAttribute(
    "style",
    `top: ${settingsCord.top}px; left: ${settingsCord.left}px; position: absolute; `
  );

  settings.append(createSettingsIcon());
  bg.append(settings);

  const timeSig = document.createElement("div");

  timeSig.id = "time-sig";
  const timeSigCord = {
    top: center.y - 24,
    left: box.left,
  };
  timeSig.setAttribute(
    "style",
    `top: ${timeSigCord.top}px; left: ${timeSigCord.left}px; position: absolute; `
  );

  timeSig.append(createTimeSigIcon());
  bg.append(timeSig);
  bg.append(timeSig);
}

function getCenter() {
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
}
/** Returns string portrait or landscape*/
function portOrLand(width: number, height: number): string {
  return height >= width ? "portrait" : "landscape";
}
window.addEventListener("resize", (_e: Event) => {
  const center = getCenter();
  const aspect = portOrLand(center.x, center.y);
  const bg = document.querySelector("#background") as HTMLDivElement;
  bg.className = aspect === "landscape" ? "bg-land" : "bg-port";
  const box = bg.getBoundingClientRect();
  console.log(box);
  console.log(center);

  const settings = document.querySelector("#settings") as HTMLDivElement;
  const timeSig = document.querySelector("#time-sig") as HTMLDivElement;

  const settingsCord = {
    top: box.top + box.height - 48,
    left: box.left + box.width / 2 - 24,
  };

  settings.setAttribute(
    "style",
    `top: ${settingsCord.top}px; left: ${settingsCord.left}px; position: absolute; `
  );
  const timeSigCord = {
    top: center.y - 24,
    left: box.left,
  };
  timeSig.setAttribute(
    "style",
    `top: ${timeSigCord.top}px; left: ${timeSigCord.left}px; position: absolute; `
  );
  bg.className = aspect === "landscape" ? "bg-land" : "bg-port";
  // console.log(bg.getBoundingClientRect());
});
function init() {
  returnBgDiv();
  createIcons();
}
init();
export {};

function createSettingsIcon() {
  const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const iconPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  iconSvg.setAttribute("width", "48");
  iconSvg.setAttribute("height", "48");

  iconPath.setAttribute(
    "d",
    "M19.4 44l-1-6.3q-.95-.35-2-.95t-1.85-1.25l-5.9 2.7L4 30l5.4-3.95q-.1-.45-.125-1.025Q9.25 24.45 9.25 24q0-.45.025-1.025T9.4 21.95L4 18l4.65-8.2 5.9 2.7q.8-.65 1.85-1.25t2-.9l1-6.35h9.2l1 6.3q.95.35 2.025.925Q32.7 11.8 33.45 12.5l5.9-2.7L44 18l-5.4 3.85q.1.5.125 1.075.025.575.025 1.075t-.025 1.05q-.025.55-.125 1.05L44 30l-4.65 8.2-5.9-2.7q-.8.65-1.825 1.275-1.025.625-2.025.925l-1 6.3zM24 30.5q2.7 0 4.6-1.9 1.9-1.9 1.9-4.6 0-2.7-1.9-4.6-1.9-1.9-4.6-1.9-2.7 0-4.6 1.9-1.9 1.9-1.9 4.6 0 2.7 1.9 4.6 1.9 1.9 4.6 1.9z"
  );

  iconSvg.appendChild(iconPath);
  return iconSvg;
}
function createTimeSigIcon() {
  const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const outerPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  const innerPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  iconSvg.setAttribute("width", "48");
  iconSvg.setAttribute("height", "48");
  iconSvg.setAttribute("fill-rule", "evenodd");
  iconSvg.setAttribute("clip-rule", "evenodd");
  iconSvg.setAttribute("stroke-linejoin", "round");
  iconSvg.setAttribute("stroke-miterlimit", "2");

  outerPath.setAttribute(
    "d",
    "M24 0c13.246 0 24 10.755 24 24 0 13.247-10.754 24-24 24S0 37.248 0 24C0 10.755 10.754 0 24 0zm0 6c9.934 0 18 8.066 18 18 0 9.935-8.066 18-18 18-9.935 0-18-8.065-18-18 0-9.934 8.065-18 18-18z"
  );
  innerPath.setAttribute(
    "d",
    "M25.008 11.76c1.504 0 2.936.312 4.296.936 1.36.624 2.472 1.472 3.336 2.544.864 1.072 1.296 2.28 1.296 3.624 0 1.184-.4 2.2-1.2 3.048-.8.848-1.808 1.272-3.024 1.272-1.088 0-1.984-.312-2.688-.936-.704-.624-1.056-1.48-1.056-2.568 0-.832.24-1.536.72-2.112a5.053 5.053 0 011.728-1.344c.352-.16.784-.296 1.296-.408.512-.112.768-.264.768-.456 0-.512-.448-.992-1.344-1.44a6.352 6.352 0 00-2.88-.672c-1.312 0-2.432.304-3.36.912-.928.608-1.624 1.648-2.088 3.12-.464 1.472-.696 3.52-.696 6.144v3.744c0 1.184.184 2.344.552 3.48.368 1.136.984 2.072 1.848 2.808.864.736 2 1.104 3.408 1.104 1.6 0 3.056-.72 4.368-2.16 1.312-1.44 2.16-3.376 2.544-5.808h1.296c-.128 1.856-.608 3.512-1.44 4.968s-1.952 2.6-3.36 3.432c-1.408.832-3.024 1.248-4.848 1.248-2.016 0-3.824-.584-5.424-1.752-1.6-1.168-2.864-2.728-3.792-4.68-.928-1.952-1.392-4.128-1.392-6.528 0-1.536.296-2.992.888-4.368a12.32 12.32 0 012.424-3.672 11.66 11.66 0 013.552-2.544 10.023 10.023 0 014.272-.936z"
  );
  innerPath.setAttribute("fill-rule", "nonzero");

  iconSvg.appendChild(outerPath);
  iconSvg.appendChild(innerPath);
  return iconSvg;
}
