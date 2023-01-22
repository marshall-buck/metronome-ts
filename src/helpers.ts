const Y_OFFSET = 76;
const X_OFFSET = 24; /** returns center x y coords of window */

function getCenter(x: number, y: number) {
  return {
    x: x / 2,
    y: y / 2,
  };
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

export {
  getCenter,
  portOrLand,
  Y_OFFSET,
  X_OFFSET,
  copyTouch,
  cartesianToPolar,
  polarToCartesian,
};
