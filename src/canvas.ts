import settingsUrl from "./icons/settings.svg";

interface CircleShape {
  x: number;
  y: number;
  radius: number;
}
interface IconShape {
  x: number;
  y: number;
  // width: number;
  // height: number;
}

class Circle {
  x: number;
  y: number;
  radius: number;
  color: string;
  type: string;
  isDragging: boolean = false;
  startPosition: CircleShape = { x: 0, y: 0, radius: 0 };

  constructor(
    x: number,
    y: number,
    radius: number,
    color: string,
    type: string
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.type = type;
  }

  resize(x: number, y: number, radius: number) {
    this.radius = radius;
    this.x = x;
    this.y = y;
  }

  setStartPosition({ x, y, radius }: CircleShape) {
    this.startPosition = { x, y, radius };
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  move(_e: MouseEvent) {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // const currentX = this.x;
    // const currentY = this.y;
    // const dx: number = clientX - currentX;
    // const dy: number = clientY - currentY;
    // this.x += dx;
    // this.y += dy;
    // this.draw(ctx);
    // this.x = clientX;
    // this.y = clientY;
  }
}

class Icon {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  isDragging: boolean = false;
  startPosition: IconShape;
  imgObj: HTMLImageElement;
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    type: string,
    imgObj: HTMLImageElement
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.imgObj = imgObj;
    this.startPosition = this.setStartPosition({ x, y });
  }
  // xCenter = (x1 + x2) / 2
  // yCenter = (y1 + y2) / 2
  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.imgObj, this.x, this.y, this.width, this.height);
  }

  resize(x: number, y: number, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
  }

  setStartPosition({ x, y }: IconShape) {
    return { x, y };
  }

  move(e: MouseEvent) {
    this.isDragging = true;
    // console.log("move", this);

    // const dx: number = mouseX - this.x;
    // const dy: number = mouseY - this.y;
    this.x += e.movementX;
    this.y += e.movementY;
    this.draw(ctx);
    // this.x = e.clientX;
    // this.y = e.clientY;
  }
}

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const iconSizes = 50;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const canvasItems: (Circle | Icon)[] = [];

const center = {
  x: canvas.getBoundingClientRect().width / 2,
  y: canvas.getBoundingClientRect().height / 2,
};
let currentRadius = radius(center.x, center.y);
const mainCircle = new Circle(
  center.x,
  center.y,
  currentRadius,
  "gray",
  "main"
);

//  center.x - 100,
// center.y + currentRadius - 200,
const settingsImage = new Image();
settingsImage.src = settingsUrl;
const settingIcon = new Icon(
  center.x - 100,
  center.y + currentRadius - 200,
  200,
  200,
  "settings",
  settingsImage
);
settingsImage.onload = () => {
  settingIcon.draw(ctx);
};

canvasItems.push(mainCircle, settingIcon);

function drawShapes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const shape of canvasItems) {
    if (!shape.isDragging) shape.draw(ctx);
  }
}
drawShapes();

/** ********************EVENT LISTENERS************************* */
window.addEventListener("resize", (e: Event) => {
  const target = e.target as Window;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  center.x = target.innerWidth / 2;
  center.y = target.innerHeight / 2;
  currentRadius = radius(center.x, center.y);
  mainCircle.resize(center.x, center.y, currentRadius);
  settingIcon.resize(center.x - 100, center.y + currentRadius - 200, 200, 200);
  // bottomCircle.resize(
  //   center.x,
  //   center.y + currentRadius - iconSizes,
  //   iconSizes
  // );
  // console.log(mainCircle);

  drawShapes();
});

canvas.addEventListener("mousedown", (e: MouseEvent) => {
  e.preventDefault();
  console.log(e);

  for (const shape of canvasItems) {
    if (
      shape instanceof Icon &&
      isInsideSquare(shape.x, shape.y, shape.width, shape.height, e.x, e.y)
    ) {
      shape.isDragging = true;
      console.log(shape);
    }
  }
});
canvas.addEventListener("mousemove", (e: MouseEvent) => {
  if (e.buttons === 0) return;
  e.preventDefault();
  console.log(e);

  for (const shape of canvasItems) {
    if (shape.isDragging) {
      drawShapes();

      shape.move(e);
    }
  }
});
canvas.addEventListener("mouseup", (e: MouseEvent) => {
  e.preventDefault();
  for (const shape of canvasItems) {
    if (shape.isDragging) {
      drawShapes();
      // shape.move(shape.startPosition.x, shape.startPosition.y);
      shape.isDragging = false;
    }
  }
});

/** determines smallest of width or height to draw circle */
function radius(centerX: number, centerY: number): number {
  return centerX >= centerY ? centerY : centerX;
}

/** checks if mouse is inside a circle. of x,y and radius
 * compared to m0use position
 */
function isInsideSquare(
  x: number,
  y: number,
  width: number,
  height: number,
  mouseX: number,
  mouseY: number
): boolean {
  if (mouseX >= x && mouseX <= x + width && mouseY >= y && mouseY >= y - height)
    return true;

  return false;
}

/** checks if mouse is inside a circle. of x,y and radius
 * compared to m0use position
 */
function isInsideCircle(
  x: number,
  y: number,
  radius: number,
  mouseX: number,
  mouseY: number
): boolean {
  if (
    mouseX >= x - radius &&
    mouseX <= x + radius &&
    mouseY >= y - radius &&
    mouseY <= y + radius
  )
    return true;

  return false;
}

export {};
