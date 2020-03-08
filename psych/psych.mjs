import input from './input.mjs';
import Success_bar from './success_bar.mjs';
import Target from './target.mjs';
import Collision from './collisions.mjs';
import ExportCSV from './exportcsv.mjs';

var task1_button = document.getElementById('task1-button');
var task2_button = document.getElementById('task2-button');
var play_menu = document.getElementById('play-menu');
var runtime_input = document.getElementById('runtime-input');
var size_input = document.getElementById('size-input');
var speed_input = document.getElementById('speed-input');
var show_reward_input = document.getElementById('show-reward-input');
var controls = document.getElementById('controls');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;
var success_bar = new Success_bar(canvas.height - 40, canvas.width - 40);
var movement = new input(document, canvas);
var collision = new Collision();
var data = [];
data.push(["target.x", "target.y", "mouse.x", "mouse.y", "millis"]);
var data_timer = { last_time: Date.now(), increment: 100 };
var target = {};
var running = false;
var show_reward = false;
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

var between = (min, max) => {
    return Math.random() * (max - min) + min;
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

var check_if_times_up = () => {
    if (Date.now() - target.start_time > runtime_input * 1000 && target.start_time > 0) {
        return true;
    }
    return false;
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
            target.start_time = Date.now();
        }
    } else {
        if (movement.click && collision.detect_cir(mouse, target) && target.task === 2) {
            controls.className = "hidden";
            target.x = between(100, canvas.width - 100);
            target.y = between(100, canvas.height - 100);
            success_bar.update(-canvas.height / 50);
            target.time = Date.now();
        }
    }
}

var run = () => {
    if (check_if_times_up()) {
        window.cancelAnimationFrame(run);
        stop();
        return;
    }
    requestAnimationFrame(run);
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (show_reward) success_bar.draw(context);
    target.draw(context);
    draw_text(["Press space to pause/show controls."]);
    update();
    if (running) {
        push_data();
        if (collision.detect_cir(target, mouse)) {
            success_bar.update(-canvas.height / 1000);
            target.col = 'green';
        }
        else {
            success_bar.update(canvas.height / 1000);
            target.col = 'red';
        }
        target.move();
    }
}

function push_data() {
    if (Date.now() - data_timer.last_time > data_timer.increment) {
        data.push([target.x, target.y, mouse.x, mouse.y, Date.now() - target.start_time]);
        data_timer.last_time = Date.now();
    }
}

var stop = () => {
    // requestAnimationFrame(stop);
    context.save();
    // context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    var time_up = "TIME IS UP!";
    var width = context.measureText(time_up).width;
    context.fillText(time_up, canvas.width / 2 - width / 2, canvas.height / 2);
    context.restore();
    ExportCSV('data_dump.csv', data);
}

var run2 = () => {
    if (check_if_times_up()) {
        window.cancelAnimationFrame(run2);
        stop();
        return;
    }
    requestAnimationFrame(run2);
    target.speed = Date.now() - target.time;
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (show_reward) success_bar.draw(context);
    target.draw(context);
    draw_text(["Press space to pause/show controls."]);
    update();
    if (running) {
        {
            push_data();
            if (target.speed >= target.max_time) {
                target.x = between(100, canvas.width - 100);
                target.y = between(100, canvas.height - 100);
                success_bar.update(canvas.height / 50);
                target.time = Date.now();
            }
        }
    }
}

var create_circle = (r, spd, task) => {
    let x = between(100, canvas.width - 100);
    let y = between(100, canvas.height - 100);
    let x2 = between(100, canvas.width - 100);
    let y2 = between(100, canvas.height - 100);
    target = new Target(x, y, 'red', r, { x: x, y: y, r: 10 }, { x: x2, y: y2, r: 10 }, spd, task);
}

function setup_task(task_num) {
    canvas.style.display = 'block';
    play_menu.style.display = 'none';
    runtime_input = parseInt(runtime_input.value);
    if (show_reward_input.value === 'yes') show_reward = true;
    let size = parseInt(size_input.value) || 30;
    let spd = parseInt(speed_input.value) || 2;
    if (task_num === 2) {
        success_bar.update(-canvas.height / 50);
        spd *= 1000;
    }
    create_circle(size, spd, task_num);
    toggle_controls();
}

task1_button.addEventListener('click', function () {
    setup_task(1);
    run();
});

task2_button.addEventListener('click', function () {
    setup_task(2);
    run2();
});