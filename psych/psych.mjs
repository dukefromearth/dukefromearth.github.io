import input from './input.mjs';
import Success_bar from './success_bar.mjs';
import Target from './target.mjs';
import Collision from './collisions.mjs';

var task1_button = document.getElementById('task1-button');
var task2_button = document.getElementById('task2-button');
var play_menu = document.getElementById('play-menu');
var shape_input = document.getElementById('shape-input');
var size_input = document.getElementById('size-input');
var speed_input = document.getElementById('speed-input');
var color_input = document.getElementById('color-input');
var controls = document.getElementById('controls');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;
var success_bar = new Success_bar(canvas.height - 40, canvas.width - 40);
var movement = new input(document, canvas);
var collision = new Collision();
var data = [];
var target = {};
var running = false;
var task2_circles = [];

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
    r: 1
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

var toggle_controls = () => {
    if (controls.className === "hidden") {
        controls.className = "play-menu";
        running = false;
    } else {
        controls.className = "hidden";
    }
}

var update = function () {
    mouse.x = movement.mousex;
    mouse.y = movement.mousey;
    if (movement.up) {
        if (target.r < 100) {
            target.r++;
        }
    }
    if (movement.down) {
        if (target.r > 5) {
            target.r--;
        }
    }
    if (movement.right) {
        target.speed += 0.25;
    }
    if (movement.left) {
        if (target.speed > 1) target.speed -= 0.25;
    }
    if (movement.space) {
        if (Date.now() - debounce_keys.space > 300) {
            toggle_controls();
            debounce_keys.space = Date.now();
        }
    }
    if (!running) {
        if (movement.click && collision.detect_cir(mouse, target)) {
            controls.className = "hidden";
            running = true;
        }
    } else {
        if (movement.click && collision.detect_cir(mouse, target) && target.task === 2) {
            controls.className = "hidden";
            target.x = Math.random() * canvas.width - 40 + 20;
            target.y = Math.random() * canvas.height - 40 + 20;
            success_bar.update(-100);
        }
    }
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

var run = () => {
    requestAnimationFrame(run);
    context.clearRect(0, 0, canvas.width, canvas.height);
    data.length = 0;
    success_bar.draw(context);
    target.draw(context);
    data.push("Press space to pause/show controls.");
    draw_text(data);
    update();
    if (running) {
        if (collision.detect_cir(target, mouse)) {
            success_bar.update(-2);
            target.col = 'green';
        }
        else {
            success_bar.update(2);
            target.col = 'red';
        }
        target.move();
    }
}

var run2 = () => {
    requestAnimationFrame(run2);
    context.clearRect(0, 0, canvas.width, canvas.height);
    data.length = 0;
    success_bar.draw(context);
    target.draw(context);
    data.push("Press space to pause/show controls.");
    draw_text(data);
    update();
    if (running) {
        {
            success_bar.update(2);
            target.col = 'red';
        }
    }
}

var create_circle = (r, spd, task) => {
    let x = Math.random() * canvas.width - 40 + 20;
    let y = Math.random() * canvas.height - 40 + 20;
    let x2 = Math.random() * canvas.width - 40 + 20;
    let y2 = Math.random() * canvas.height - 40 + 20;
    target = new Target(x, y, 'red', r, { x: x, y: y, r: 10 }, { x: x2, y: y2, r: 10 }, spd, task);
}

task1_button.addEventListener('click', function () {
    canvas.style.display = 'block';
    play_menu.style.display = 'none';
    let size = parseInt(size_input.value) || 30;
    let spd = parseInt(speed_input.value) || 2;
    let task = 1;
    create_circle(size, spd, task);
    toggle_controls();
    run();
});

task2_button.addEventListener('click', function () {
    canvas.style.display = 'block';
    play_menu.style.display = 'none';
    let size = parseInt(size_input.value) || 30;
    let spd = parseInt(speed_input.value) || 2;
    let task = 2;
    create_circle(size, spd, task);
    toggle_controls();
    run2();
});