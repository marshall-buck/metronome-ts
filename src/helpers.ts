const Y_OFFSET = 76;
const X_OFFSET = 24; /** returns center x y coords of window */

function getCenter() {
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
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

export { getCenter, portOrLand, Y_OFFSET, X_OFFSET, copyTouch };
