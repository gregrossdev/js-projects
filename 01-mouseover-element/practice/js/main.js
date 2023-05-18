console.log("hello world!");

const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
const tx = window.innerWidth;
const ty = window.innerHeight;

canvas.width = tx;
canvas.height = ty;
//c.lineWidth= 5;
//c.globalAlpha = 0.5;


let mousex = 0;
let mousey = 0;
addEventListener("mousemove", () => {
  mousex = event.clientX;
  mousey = event.clientY;
});


const grav = 0.99;
c.strokeWidth = 5;

function randomColor() {
  return (
    "rgba(" +
    Math.round(Math.random() * 250) +
    "," +
    Math.round(Math.random() * 250) +
    "," +
    Math.round(Math.random() * 250) +
    "," +
    Math.ceil(Math.random() * 10) / 10 +
    ")"
  );
}

class Ball {
  constructor() {
    this.color = randomColor();
    this.radius = Math.random() * 20 + 14;
    this.startradius = this.radius;
    this.x = Math.random() * (tx - this.radius * 2) + this.radius;
    this.y = Math.random() * (ty - this.radius);
    this.dy = Math.random() * 2;
    this.dx = Math.round((Math.random() - 0.5) * 10);
    this.vel = Math.random() / 5;
  }
  
  update() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    c.fillStyle = this.color;
    c.fill();
    //c.stroke();
  };
}

const ballCollection = [];
for (let i = 0; i < 50; i++) {
  ballCollection.push(new Ball());
}

function animate() {
  if (tx != window.innerWidth || ty != window.innerHeight) {
    tx = window.innerWidth;
    ty = window.innerHeight;
    canvas.width = tx;
    canvas.height = ty;
  }
  // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
  requestAnimationFrame(animate);
  c.clearRect(0, 0, tx, ty);
  for (var i = 0; i < ballCollection.length; i++) {
    ballCollection[i].update();
    ballCollection[i].y += ballCollection[i].dy;
    ballCollection[i].x += ballCollection[i].dx;
    if (ballCollection[i].y + ballCollection[i].radius >= ty) {
      ballCollection[i].dy = -ballCollection[i].dy * grav;
    } 
    else {
      ballCollection[i].dy += ballCollection[i].vel;
    }
    if (ballCollection[i].x + ballCollection[i].radius > tx || ballCollection[i].x - ballCollection[i].radius < 0) {
      ballCollection[i].dx = -ballCollection[i].dx;
    }
    if (mousex > ballCollection[i].x - 20 &&
      mousex < ballCollection[i].x + 20 &&
      mousey > ballCollection[i].y - 50 &&
      mousey < ballCollection[i].y + 50 &&
      ballCollection[i].radius < 70) {
      //ballCollection[i].x += +1;
      ballCollection[i].radius += 5;
    } 
    else {
      if (ballCollection[i].radius > ballCollection[i].startradius) {
        ballCollection[i].radius += -5;
      }
    }
  }
}

animate();

setInterval(function() {
  ballCollection.push(new Ball());
  ballCollection.splice(0, 1);
}, 400);
