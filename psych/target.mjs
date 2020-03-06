import Collisions from './collisions.mjs';
let collision = new Collisions();

export default class Target {
    constructor(x, y, color, radius, pt1, pt2, speed) {
        this.x = x;
        this.y = y;
        this.col = color;
        this.r = radius;
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
        if (collision.detect_cir(this, this.pt2)) {
            this.dir = 1;
            let x = Math.random() * canvas.width - 40 + 20;
            let y = Math.random() * canvas.height - 40 + 20;
            this.pt1.x = x;
            this.pt1.y = y;
        }
        else if (collision.detect_cir(this, this.pt1)) {
            this.dir = 0;
            let x = Math.random() * canvas.width - 40 + 20;
            let y = Math.random() * canvas.height - 40 + 20;
            this.pt2.x = x;
            this.pt2.y = y;
        }
    }
    draw(context) {
        context.strokeStyle = this.col;
        context.lineWidth = 7;
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        context.stroke();
    }
}