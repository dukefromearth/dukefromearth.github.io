export default class Message {
    constructor(x, y, r, color, targetX, targetY, speed, msg, data) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.width = r * 2;
        this.height = r * 2
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = speed;
        this.color = color;
        this.msg = msg;
        this.data = data;
        this.delete = false;
    }
    update() {
        if (Math.abs(this.x - this.targetX) > 5 || Math.abs(this.y - this.targetY) > 5) {
            let ang = Math.atan2(this.targetY - this.y, this.targetX - this.x);
            this.x += Math.cos(ang) * this.speed;
            this.y += Math.sin(ang) * this.speed;
        } else {
            this.delete = true;
        }
    }
    draw(ctx) {
        this.update();
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.font = '14px verdana';
        ctx.fillText("Msg: " + this.msg, this.x - this.r, this.y + this.r + 15);
        ctx.fillText("Data: " + this.data, this.x - this.r, this.y + this.r + 30);
        ctx.restore();
    }
}