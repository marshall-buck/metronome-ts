import { portOrLand } from "./helpers";

const topLeft = document.querySelector("#top-left");
const bottomRight = document.querySelector("#bottom-right");
const app = document.querySelector("#app");
/** Initialize App */
function init() {
  const ratio = portOrLand();
  if (ratio === "landscape") {
    topLeft?.setAttribute("class", "landscape");
    bottomRight?.setAttribute("class", "landscape");
    app?.setAttribute("class", "app-land");
  } else {
    topLeft?.setAttribute("class", "portrait");
    bottomRight?.setAttribute("class", "portrait");
    app?.setAttribute("class", "app-port");
  }
}

function resizeWindow(e: Event) {
  const ratio = portOrLand();
  console.log(ratio);

  if (ratio === "landscape") {
    topLeft?.setAttribute("class", "landscape");
    bottomRight?.setAttribute("class", "landscape");
    app?.setAttribute("class", "app-land");
  } else {
    topLeft?.setAttribute("class", "portrait");
    bottomRight?.setAttribute("class", "portrait");
    app?.setAttribute("class", "app-port");
  }
}
window.addEventListener("resize", resizeWindow);

init();
