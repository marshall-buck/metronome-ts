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
  position: CircleShape = { x: 0, y: 0, radius: 0 };

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

  startPosition({ x, y, radius }: CircleShape) {
    this.position = { x, y, radius };
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  move(clientX: number, clientY: number) {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    const currentX = this.x;
    const currentY = this.y;
    const dx: number = clientX - currentX;
    const dy: number = clientY - currentY;
    this.x += dx;
    this.y += dy;
    this.draw(ctx);
    this.x = clientX;
    this.y = clientY;
  }
}

class Icon {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  isDragging: boolean = false;
  position: IconShape = { x: 0, y: 0, width: 0, height: 0 };
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
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.imgObj, this.x, this.y, this.width, this.height);
  }

  resize(x: number, y: number, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
  }

  startPosition({ x, y }: IconShape) {
    this.position = { x, y };
  }

  move(clientX: number, clientY: number) {
    const currentX = this.x;
    const currentY = this.y;
    const dx: number = clientX - currentX;
    const dy: number = clientY - currentY;
    this.x += dx;
    this.y += dy;
    this.draw(ctx);
    this.x = clientX;
    this.y = clientY;
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

// const bottomCircle = new Circle(
//   center.x,
//   center.y + currentRadius - iconSizes,
//   iconSizes,
//   "red",
//   "volume"
// );

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
  for (const circle of canvasItems) {
    if (!circle.isDragging) circle.draw(ctx);
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

/** determines smallest of width or height to draw circle */
function radius(centerX: number, centerY: number): number {
  return centerX >= centerY ? centerY : centerX;
}

canvas.addEventListener("mousedown", (e: MouseEvent) => {
  e.preventDefault();
  for (const circle of canvasItems) {
    // console.log(circle);
    if (
      circle instanceof Icon &&
      isInsideSquare(circle.x, circle.y, circle.width, circle.height, e.x, e.y)
    ) {
      const start = {
        x: circle.x,
        y: circle.y,
        // width: circle.width,
        // height: circle.height,
      };
      circle.startPosition(start);

      circle.isDragging = true;
      console.log(circle);
    }
  }
});
canvas.addEventListener("mousemove", (e: MouseEvent) => {
  e.preventDefault();

  for (const circle of canvasItems) {
    if (circle.isDragging) {
      drawShapes();

      circle.move(e.x, e.y);
    }
  }
});
canvas.addEventListener("mouseup", (e: MouseEvent) => {
  e.preventDefault();
  for (const circle of canvasItems) {
    if (circle.isDragging) {
      drawShapes();
      circle.move(circle.position.x, circle.position.y);
      circle.isDragging = false;
    }
  }
});

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
