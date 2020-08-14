import Block from './block.js';
import { loadImages } from './utils.js';
import Message from './message.js';
import smallCanvas from './innerCanvas.js'

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const innerCanvas = document.getElementById('innerCanvas');
const innerCtx = canvas.getContext('2d');

canvas.width = Math.max(1900, window.innerWidth);
canvas.height = Math.max(1200, window.innerHeight);
innerCanvas.width = 200;
innerCanvas.height = 200;

let loadedImages = loadImages();
let messages = [];
let codeImage = null;

let node = new Block(7 * canvas.width / 18, 0, loadedImages["node-logo"], "NODE.JS", "", 150, 150, false,);
let frontend = new Block(5 * canvas.width / 18, canvas.height / 4, loadedImages["frontend-logo"], "FRONT END", "", 150, 150, false,);
let backend = new Block(9 * canvas.width / 18, canvas.height / 4, loadedImages["backend-logo"], "BACK END", "", 150, 150, false,);
let socketFront = new Block(3 * canvas.width / 9, 2 * canvas.height / 4, loadedImages["socket-logo"], "SOCKET.IO FRONT", "", 150, 150, true, loadedImages["socket-front-code"]);
let socketBack = new Block(4 * canvas.width / 9, 2 * canvas.height / 4, loadedImages["socket-logo"], "SOCKET.IO BACK", "", 150, 150, true, loadedImages["socket-back-code"]);
let serialport = new Block(5 * canvas.width / 9, 2 * canvas.height / 4, loadedImages["serialport-logo"], "SERIALPORT", "", 150, 150, true, loadedImages["serialport-code"]);
let arduino = new Block(6 * canvas.width / 9, 2 * canvas.height / 4, loadedImages["arduino-logo"], "ARDUINO", "", 150, 150, true, loadedImages["arduino-code"]);
let button = new Block(7 * canvas.width / 9, 2 * canvas.height / 4, loadedImages["button"], "BUTTON (click me)", "", 150, 150, false,);
let innerC = new smallCanvas(2 * canvas.width / 9, 2 * canvas.height / 4, loadedImages["canvas-code"]);
button.clicked = false;

let blocks = [node, frontend, backend, socketFront, socketBack, serialport, arduino, button];

console.log(blocks);

node.addArrows([frontend, backend]);
frontend.addArrows([socketFront, innerC]);
backend.addArrows([socketBack, serialport]);
serialport.addArrows([socketBack]);
socketBack.addArrows([socketFront])
arduino.addArrows([serialport]);
button.addArrows([arduino]);
socketBack.addArrows([innerC]);

window.addEventListener('resize', function () {
    canvas.width = Math.max(1900, window.innerWidth);
    canvas.height = Math.max(1200, window.innerHeight);
});

canvas.addEventListener('mousedown', function (event) {
    let distance = Math.sqrt(Math.pow(event.clientX - button.x, 2) + Math.pow(event.clientY - button.y, 2));
    if (distance < button.width) {
        button.clicked = true;
    }
});

canvas.addEventListener('mouseup', function (event) {
    button.clicked = false;
})

canvas.addEventListener('mousemove', function (event) {
    let mouse = { x: event.x, y: event.y, width: 1, height: 1 };
    if (socketFront.collides(mouse)) codeImage = socketFront.code;
    else if (socketBack.collides(mouse)) codeImage = socketBack.code;
    else if (serialport.collides(mouse)) codeImage = serialport.code;
    else if (arduino.collides(mouse)) codeImage = arduino.code;
    else if (innerC.collides(mouse)) codeImage = innerC.code;
    else codeImage = null;
})

setInterval(function () {
    if (button.clicked) messages.push(new Message(arduino.x, arduino.y + arduino.height / 2, 20, 'green', innerC.x, innerC.y + innerC.height / 2, 3.5, "click", "1"));
    else messages.push(new Message(arduino.x, arduino.y + arduino.height / 2, 20, 'red', serialport.x, serialport.y + serialport.height / 2, 3.5, "click", "0"));
}, 1000);

const render = () => {
    requestAnimationFrame(render);
    ctx.fillStyle = 'lightgrey'
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    for (let b of blocks) {
        b.drawLines(ctx);
    }
    for (let b of blocks) {
        b.draw(ctx);
        for (let m of messages) {
            b.collides(m);
        }
    }
    innerC.draw(innerCtx);
    for (let i = 0; i < messages.length; i++) {
        let m = messages[i];
        if (m.delete) {
            innerC.moveRect(m.data * 10);
            messages.splice(i, 1);
        }
        else m.draw(ctx);
    }
    if (codeImage) {
        ctx.drawImage(codeImage, canvas.width / 2 - 248, 5 * canvas.height / 7, 495, 300);
    }

}

render();
