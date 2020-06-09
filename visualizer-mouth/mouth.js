// Initialize Canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let mouths = [];
let mouthImg = document.getElementById('mouthImg');
let mic = new p5.AudioIn();
mic.start();

/**
*
* Begin Custom Animation
*
**/

// Create a Mouth class that with a draw method that takes in the audio value
class Mouth {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw(audioVal) {
        audioVal *= 1000;
        ctx.save();
        ctx.translate(this.x, this.y)
        ctx.drawImage(
            mouthImg,
            -(this.width) / 2,
            -(this.height) / 2,
            this.width,
            this.height + audioVal);
        ctx.restore();
    }
}

// Loop to quantity and create mouth in a different location and size.
const createMouths = function (quantity) {
    for (let i = 0; i < quantity; i++) {
        let width = Math.random() * 300;
        let height = width / 2;
        mouths.push(new Mouth(canvas.width * Math.random(), canvas.height * Math.random(), width, height))
    }
}

createMouths(10);

// Run animation
function run() {
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let mouth of mouths) {
        if (mic != null) {
            mouth.draw(mic.getLevel());
        }
        else {
            mouth.draw(1);
        }
    }
    requestAnimationFrame(run);
}

run();