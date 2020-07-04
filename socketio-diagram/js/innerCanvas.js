export default class smallCanvas {
    constructor(x, y, code) {
        this.block = {
            x: x,
            y: y + 55,
            width: 40,
            height: 40
        }
        this.x = x;
        this.y = y;
        this.width = 150;
        this.height = 150;
        this.code = code;
    }
    moveRect(data) {
        this.block.x += data;
    }
    draw(ctx) {
        ctx.fillRect(this.x - 75, this.y, this.width, this.height);
        ctx.fillStyle = 'red';
        ctx.fillRect(this.block.x - 75, this.block.y, this.block.width, this.block.height);
        ctx.fillStyle = 'black';
    }
    collides(object) {
        if (object.x < this.x + this.width / 2 &&
            object.x + this.width / 2 > this.x &&
            object.y < this.y + this.height &&
            object.y + this.height > this.y) {
            return true;
        }
        else {
            return false;
        }
    }
}

