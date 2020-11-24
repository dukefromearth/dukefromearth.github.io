import Collisions from './collisions.js';
let collision = new Collisions();

export default class Target {
    constructor(x, y, color, radius, pt1, pt2, speed, task, reward) {
        this.x = x;
        this.y = y;
        this.col = color;
        this.r = radius;
        this.dir = 0;
        this.pt1 = pt1;
        this.pt2 = pt2;
        this.speed = speed;
        this.task = task;
        this.time = 0;
        this.max_time = speed;
        this.start_time = 0;
        this.reward = reward;
        this.score = 0;
        this.current_score = 0;
        this.last_update = Date.now();
        this.update_interval = 1000;
    }
    translate(x, y) {
        this.x += x;
        this.y += y;
    }
    move() {
        if (this.task === 1) {
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
    }
    draw(context) {
        context.strokeStyle = this.col;
        context.lineWidth = 7;
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        context.stroke();
    }
    update_score(amount) {
        let ratio = (Date.now() - this.last_update) / this.update_interval;
        this.score += ratio * amount;
        let increment = this.score - this.current_score < -1 ? -1 : 1;
        let self = this;
        if (Math.abs(this.score - this.current_score) > 1) {
            for (let i = 0; i < Math.abs(this.score - this.current_score); i++) {
                setTimeout(function () {
                    self.current_score += increment;
                }, i);
            }
        } else {
            this.current_score = this.score;
        }
        this.last_update = Date.now();
    }
    draw_score(context, canvas) {
        console.log(this.current_score, this.score);
        context.save();
        context.font = "30px Arial";
        let text = "SCORE: " + Math.floor(this.current_score);
        context.fillText(text, canvas.width / 2 - context.measureText(text).width / 2, canvas.height / 20);
        context.restore();
    }
    draw_data(context, canvas) {
        context.save();
        context.font = "20px Arial";
        if (this.task === 2) {
            context.fillText("speed: " + this.max_time / 1000 + " seconds", canvas.width - 400, canvas.height / 20);
            context.fillText("reward: " + this.reward + "x", canvas.width - 400, canvas.height / 20 + 20);
            context.fillText("size: " + this.r, canvas.width - 400, canvas.height / 20 + 40);
        }
        else {
            context.fillText("speed: " + this.speed, canvas.width - 400, canvas.height / 20);
            context.fillText("reward: " + this.reward + "x", canvas.width - 400, canvas.height / 20 + 20);
            context.fillText("size: " + this.r, canvas.width - 400, canvas.height / 20 + 40);
        }
        context.restore();
    }
}