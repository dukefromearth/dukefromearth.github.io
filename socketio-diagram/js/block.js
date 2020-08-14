export default class Block {
    constructor(x, y, img, msg, data, width, height, hasData, code) {
        this.x = x;
        this.y = y;
        this.img = img;
        this.arrows = [];
        this.msg = msg;
        this.data = data;
        this.width = width;
        this.height = height;
        this.hasData = hasData;
        this.code = code;
    }
    addArrows(blocks) {
        for (let b of blocks) {
            this.arrows.push(b);
        }
    }
    drawLines(ctx) {
        ctx.save();
        ctx.lineWidth = 5;
        for (let a of this.arrows) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + this.height / 2);
            ctx.lineTo(a.x, a.y + a.height / 2);
            ctx.stroke();
        }
        ctx.restore();
    }
    draw(ctx) {
        if (this.clicked) {
            ctx.drawImage(this.img, this.x - this.width / 4, this.y + this.width / 4, this.width / 2, this.height / 2);
        } else {
            ctx.drawImage(this.img, this.x - this.width / 2, this.y, this.width, this.height);
        }
        ctx.save();
        ctx.font = "20px Verdana";
        let txtWidth = ctx.measureText(this.msg).width;

        ctx.fillStyle = 'black';
        ctx.fillRect(this.x - 100, this.y + 170, 200, 45);
        ctx.fillStyle = 'white';
        ctx.fillText(this.msg, this.x - txtWidth / 2, this.y + 200);
        ctx.restore();
    }
    collides(object) {
        if (object.x < this.x + this.width / 2 &&
            object.x + this.width / 2 > this.x &&
            object.y < this.y + this.height &&
            object.y > this.y) {
            return true;
        }
        else {
            return false;
        }
    }
}