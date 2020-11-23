import input from './input.js';
import Success_bar from './success_bar.js';
import Target from './target.js';
import Collision from './collisions.js';
import ExportCSV from './exportcsv.js';

/********************* SETUP **********************/

var task1_button = document.getElementById('task1-button');
var task2_button = document.getElementById('task2-button');
var export_csv_button = document.getElementById('export-csv-button');
var export_csv_input = document.getElementById('export-csv-input');
var reload_button = document.getElementById('reload-button');
var reward_input = document.getElementById('reward-input');
var stop_menu = document.getElementById('stop-menu');
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
data.push(["target.x", "target.y", "mouse.x", "mouse.y", "distance_to_target", "reward", "current_reward", "millis"]);
var data_timer = { last_time: Date.now(), increment: 100 };
var target = {};
var running = false;
var show_reward = false;
var debounce_keys = {
    space: 0,
    left: 0,
    right: 0,
    down: 0,
    up: 0
};
var mouse = {
    x: 0,
    y: 0,
    r: 1
}
function updateLiveRegion(liveRegionID, textString) {
    let textNode = document.createTextNode(textString);
    let targetNode = document.getElementById(liveRegionID);
    while (targetNode.firstChild) {
        targetNode.removeChild(targetNode.firstChild);
    }
    targetNode.appendChild(textNode);
}
/********************* UTILITIES **********************/

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

var toggle_controls = (option) => {
    if (controls.className === "hidden") {
        controls.className = "play-menu";
        stop_menu.className = "hidden";
        running = false;
    } else {
        controls.className = "hidden";
        if (option) stop_menu.className = "play-menu";
    }
}

var check_if_times_up = () => {
    if (Date.now() - target.start_time > runtime_input * 1000 && target.start_time > 0) {
        return true;
    }
    return false;
}

function push_data() {
    if (Date.now() - data_timer.last_time > data_timer.increment) {
        let targetX = Math.floor(target.x);
        let targetY = Math.floor(target.y);
        let time = Date.now() - target.start_time;
        let distance = Math.sqrt(Math.pow(targetX - mouse.x, 2) + Math.pow(targetY - mouse.y, 2))
        data.push([targetX, targetY, mouse.x, mouse.y, distance, target.reward, target.score, time]);
        data_timer.last_time = Date.now();
    }
}

var create_circle = (r, spd, task, reward) => {
    let x = between(100, canvas.width - 100);
    let y = between(100, canvas.height - 100);
    let x2 = between(100, canvas.width - 100);
    let y2 = between(100, canvas.height - 100);
    target = new Target(x, y, 'red', r, { x: x, y: y, r: 10 }, { x: x2, y: y2, r: 10 }, spd, task, reward);
}

var update = function () {
    mouse.x = movement.mousex;
    mouse.y = movement.mousey;
    if (movement.up) {
        if (Date.now() - debounce_keys.up > 300) {
            debounce_keys.up = Date.now();
            if (target.r < 100) {
                target.r += 5;
            }
        }
    }
    if (movement.down) {
        if (Date.now() - debounce_keys.left > 300) {
            debounce_keys.left = Date.now();
            if (target.r > 5) {
                target.r -= 5;
            }
        }
    }
    if (movement.right) {
        if (Date.now() - debounce_keys.right > 300) {
            debounce_keys.right = Date.now();
            if (target.task === 1) {
                if (target.speed < 10) target.speed += 1;
            } else {
                target.max_time -= 500;
            }
        }
    }
    if (movement.left) {
        if (Date.now() - debounce_keys.left > 300) {
            debounce_keys.left = Date.now();
            if (target.task === 1) {
                if (target.speed > 1) target.speed -= 1;
            } else {
                target.max_time += 500;
            }
        }
    }
    if (movement.space) {
        if (Date.now() - debounce_keys.space > 300) {
            toggle_controls();
            debounce_keys.space = Date.now();
        }
    }
    if (running) {
        if (movement.click && collision.detect_cir(mouse, target) && target.task === 2) {
            controls.className = "hidden";
            target.x = between(100, canvas.width - 100);
            target.y = between(100, canvas.height - 100);
            success_bar.update((-canvas.height / 50) * target.reward);
            target.update_score(target.reward);
            target.time = Date.now();
            console.log("running hit", target.speed, target.max_time);
        }
    } else {
        if (movement.click && collision.detect_cir(mouse, target)) {
            controls.className = "hidden";
            target.start_time = Date.now();
            if (target.task === 2) target.speed = 0;
            running = true;
            target.time = Date.now();
            console.log("non running hit", target.speed, target.max_time);
        }
    }
}

/********************* RUNNING ANIMATIONS **********************/

var run_task1 = () => {
    if (check_if_times_up()) {
        window.cancelAnimationFrame(run_task1);
        stop();
        return;
    }
    requestAnimationFrame(run_task1);
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (show_reward) success_bar.draw(context);
    target.draw(context);
    draw_text(["Press space to pause/show controls."]);
    update();

    if (running) {
        push_data();
        target.draw_score(context, canvas);
        if (collision.detect_cir(target, mouse)) {
            success_bar.update((-canvas.height / 1000) * target.reward);
            target.update_score(target.reward / 5);
            target.col = 'green';
        }
        else {
            success_bar.update((canvas.height / 1000) * target.reward);
            target.update_score(-target.reward / 5);
            target.col = 'red';
        }
        target.move();
    } else {
        target.draw_data(context, canvas);
    }
}

var run_task2 = () => {
    if (check_if_times_up()) {
        window.cancelAnimationFrame(run_task2);
        stop();
        return;
    }
    requestAnimationFrame(run_task2);

    target.speed = Date.now() - target.time;
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (show_reward) {
        success_bar.draw(context)
        target.draw_score(context, canvas)
    }
    target.draw(context);

    draw_text(["Press space to pause/show controls."]);
    update();
    if (running) {
        push_data();
        if (target.speed >= target.max_time) {
            target.x = between(100, canvas.width - 100);
            target.y = between(100, canvas.height - 100);
            success_bar.update((canvas.height / 50) * target.reward);
            target.update_score(-target.reward);
            target.time = Date.now();
            console.log("times up", target.speed, target.max_time)
        }
    } else {
        target.draw_data(context, canvas);
    }
}

var stop = () => {
    requestAnimationFrame(stop);
    context.save();
    // context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    var time_up = "TIME IS UP!";
    var width = context.measureText(time_up).width;
    context.fillText(time_up, canvas.width / 2 - width / 2, canvas.height / 2);
    context.restore();
    stop_menu.className = "play-menu";
}

function setup_task(task_num) {
    canvas.style.display = 'block';
    play_menu.style.display = 'none';
    runtime_input = parseInt(runtime_input.value);
    if (show_reward_input.value === 'yes') show_reward = true;
    let size = parseInt(size_input.value) || 30;
    let spd = parseInt(speed_input.value) || 2;
    let reward = parseInt(reward_input.value) || 11;
    if (task_num === 2) {
        success_bar.update(-canvas.height / 50);
        spd *= 1000;
    }
    create_circle(size, spd, task_num, reward);
    toggle_controls();
}

/********************* BUTTON INPUT **********************/

task1_button.addEventListener('click', function () {
    setup_task(1);
    // console.log(event);
    canvas.addEventListener('mousemove', function (event) {
        if (event.region) {
            alert('hit region: ' + event.region);
        }
    });
    run_task1();

});

task2_button.addEventListener('click', function () {
    setup_task(2);
    canvas.addEventListener('mousemove', function (event) {
        // console.log(event);
        if (event.region) {
            alert('hit region: ' + event.region);
        }
    });
    run_task2();
});


export_csv_button.addEventListener('click', function () {
    ExportCSV(export_csv_input.value + ".csv", data);
    window.location.reload()
});