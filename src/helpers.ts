const Y_OFFSET = 76;
const X_OFFSET = 24; /** returns center x y coords of window */

function getRadiusFromBoxWidth(box: DOMRect) {
  return box.width / 2;
}
/** Returns string portrait or landscape*/
function portOrLand(): string {
  return window.innerHeight >= window.innerWidth ? "portrait" : "landscape";
}

function copyTouch(touch: PointerEvent) {
  return {
    identifier: touch.pointerId,
    pageX: touch.x,
    pageY: touch.y,
  };
}

function cartesianToPolar(x: number, y: number) {
  return {
    r: Math.sqrt(x * x + y * y),
    theta: Math.atan2(y, x),
  };
}

function polarToCartesian(r: number, theta: number) {
  return {
    x: r * Math.cos(theta),
    y: r * Math.sin(theta),
  };
}
function getCenterOfObject(rect: DOMRect) {
  const mainSVGContainer = document.querySelector("#main-svg") as SVGElement;
  const mainSVGContainerRect = mainSVGContainer?.getBoundingClientRect();
  console.log(mainSVGContainerRect);

  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

export {
  getRadiusFromBoxWidth,
  portOrLand,
  Y_OFFSET,
  X_OFFSET,
  copyTouch,
  cartesianToPolar,
  polarToCartesian,
  getCenterOfObject,
};
