import input from './input.mjs';
import Success_bar from './success_bar.mjs';


const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth - 40;
canvas.height = window.innerHeight - 40;
var success_bar = new Success_bar(canvas.height - 40);
var movement = new input(document, canvas);
var debounce_keys = {
    space: 0,
    a: 0,
    d: 0,
    s: 0,
    w: 0
};

var mouse = {
    x: 0,
    y: 0,
    width: 20,
    height: 20
}

var debounce = (some_func, some_var, time) => {
    console.log(some_func);
    if (Date.now() - some_var > time) {
        some_func;
        some_var = Date.now();
    }
}

var draw_text = function (text_arr) {
    context.fillStyle = 'white';
    context.font = "20px Ariel";
    for (let i = 0; i < text_arr.length; i++) {
        let text = text_arr[i];
        let text_width = context.measureText(text).width;
        context.fillText(text, canvas.width / 2 - text_width / 2, canvas.height - 50 - i * 24);
    }
}

/****************************  CREATE A FILLED CIRCLE  ****************************/

class Circle {
    constructor(x, y, color, radius, pt1, pt2, speed) {
        this.x = x;
        this.y = y;
        this.col = color;
        this.r = radius;
        this.width = radius * 2;
        this.height = radius * 2;
        this.dir = 0;
        this.pt1 = pt1;
        this.pt2 = pt2;
        this.speed = speed;
    }
    translate(x, y) {
        this.x += x;
        this.y += y;
    }
    move() {
        if (this.dir === 1) {
            let angle = Math.atan2(this.pt1.y - this.y, this.pt1.x - this.x);
            this.y += Math.sin(angle) * this.speed;
            this.x += Math.cos(angle) * this.speed;
        } else {
            let angle = Math.atan2(this.pt2.y - this.y, this.pt2.x - this.x);
            this.y += Math.sin(angle) * this.speed;
            this.x += Math.cos(angle) * this.speed;
        }
        if (detect_collision(this, this.pt2)) {
            this.dir = 1;
            let x = Math.random() * canvas.width - 40 + 20;
            let y = Math.random() * canvas.height - 40 + 20;
            this.pt1.x = x;
            this.pt1.y = y;
        }
        else if (detect_collision(this, this.pt1)) {
            this.dir = 0;
            let x = Math.random() * canvas.width - 40 + 20;
            let y = Math.random() * canvas.height - 40 + 20;
            this.pt2.x = x;
            this.pt2.y = y;
        }
    }
    draw() {
        context.fillStyle = this.col;
        context.beginPath();
        context.arc(this.x, this.y, this.r * 2, 0, 2 * Math.PI);
        // console.log(this.x, this.y, this.r*2);
        context.fill();
    }
}

var detect_collision = function (rect1, rect2) {
    if (rect1.x - rect1.width < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y - rect1.height < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y) {
        return true;
    }
    return false;
}

let data = [];
let x = Math.random() * canvas.width - 40 + 20;
let y = Math.random() * canvas.height - 40 + 20;
let cir = new Circle(x, y, 'red', 15, { x: x, y: y, width: 10, height: 10 }, { x: 300, y: 50, width: 10, height: 10 }, 2);

var toggle_controls = () => {
    var x = document.getElementById("glasspane");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

var update = function () {
    mouse.x = movement.mousex;
    mouse.y = movement.mousey;
    if (movement.up) {
        if (cir.r < 100) {
            cir.r++;
            cir.width = cir.r * 2;
            cir.height = cir.r * 2;
        }
    }
    if (movement.down) {
        if (cir.r > 5) {
            cir.r--;
            cir.width -= 2;
            cir.height -= 2;
        }
    }
    if (movement.right) {
        cir.speed+= 0.25;
    }
    if (movement.left) {
        if (cir.speed > 1) cir.speed-= 0.25;
    }
    if (movement.space) {
        if (Date.now() - debounce_keys.space > 300) {
            toggle_controls();
            debounce_keys.space = Date.now();
        }
    }
    success_bar.update();
}

class Data {
    constructor() {
        this.raw = [];
    }
    add(data) {
        this.push(JSON.stringify(data));
    }
    save() {

    }
}

setInterval(function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    data.length = 0;
    data.push("x: " + movement.mousex + ", y: " + movement.mousey);
    cir.draw();
    cir.move();
    success_bar.draw(context);
    update();
    if (detect_collision(cir, mouse)) {
        success_bar.update(true);
        // let x = Math.random() * canvas.width - 40 + 20;
        // let y = Math.random() * canvas.height - 40 + 20;
        // cir.x = x;
        // cir.y = y;
        // cir.pt2.x = x;
        // cir.pt2.y = y;
    }
    else success_bar.update(false);
    draw_text(data);
}, 1000 / 120);