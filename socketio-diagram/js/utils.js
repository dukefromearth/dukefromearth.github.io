
let images = [
    {
        id: "arduino-logo",
        src: "../assets/arduino-logo.png"
    },
    {
        id: "button",
        src: "../assets/button.png"
    },
    {
        id: "socket-logo",
        src: "../assets/socket-logo.png"
    },
    {
        id: "node-logo",
        src: "../assets/node-logo.png"
    },
    {
        id: "backend-logo",
        src: "../assets/backend-logo.png"
    },
    {
        id: "frontend-logo",
        src: "../assets/frontend-logo.png"
    },
    {
        id: "serialport-logo",
        src: "../assets/serialport-logo.png"
    },
    {
        id: "serialport-code",
        src: "../assets/serialport-code.png"
    },
    {
        id: "socket-front-code",
        src: "../assets/socket-front-code.png"
    },
    {
        id: "socket-back-code",
        src: "../assets/socket-back-code.png"
    },
    {
        id: "arduino-code",
        src: "../assets/arduino-code.png"
    },
    {
        id: "canvas-code",
        src: "../assets/canvas-code.png"
    }
]

export function loadImages() {
    let rv = {};
    for (let i = 0; i < images.length; i++) {
        rv[images[i].id] = new Image();
        rv[images[i].id].src = images[i].src;
    }
    return rv;
}