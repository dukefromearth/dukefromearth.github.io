var synth = new Tone.Synth().toDestination();
synth.volume.value = -12;

class Experience {
    constructor(container) {
        this.canvas = document.createElement("canvas");
        container.appendChild(this.canvas);
        this.context = this.canvas.getContext("2d");

        const fps = 60;//60
        this.fpsInterval = 1000 / fps;
        this.then = Date.now();

        this.point = { x: 0, y: 0 };
        this.distPoint = { x: 0, y: 0 };
        this.pos = { x: 0, y: 0 };

        this.resize();
        this.bind();

        this.image = new Image();
        this.image.src = "https://assets.codepen.io/4147509/canvas.png";
        this.image.crossOrigin = "Anonymous";
        this.image.onload = () => {
            this.loop();
        };
    }

    bind() {
        window.addEventListener("resize", this.resize.bind(this), false);

        this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));

        this.canvas.addEventListener("touchmove", function (e) {
            e.preventDefault();
            this.onTouchMove.bind(this);
        });

    }

    avgVal() {
        let sum = 0;
        let num = 0;
        let size = 5;
        if (this.pos.x < size || this.pos.x > this.canvas.width - size || this.pos.y < size || this.pos.y > this.canvas.height - size) {
            return this.context.getImageData(this.pos.x, this.pos.y, 1, 1).data[0];
        } else {
            for (let i = this.pos.x - size; i < this.pos.x + size; i++) {
                for (let j = this.pos.y - size; j < this.pos.y + size; j++) {
                    sum += this.context.getImageData(this.pos.x, this.pos.y, 1, 1).data[0];
                    num++;
                }
            }
        }
        return sum / num;
    }

    render() {
        this.clear();
        // this.context.save()
        this.context.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);

        // synth.triggerAttackRelease(250, "256n");
        let val = this.avgVal();
        console.log(val);
        // var p = this.context.getImageData(this.pos.x, this.pos.y, 1, 1).data;
        synth.triggerAttackRelease(val, 0.01);

        this.pos.x += (this.point.x - this.pos.x) * 0.2;
        this.pos.y += (this.point.y - this.pos.y) * 0.2;

        this.context.save();
        this.context.beginPath();
        this.context.arc(this.pos.x, this.pos.y, this.canvas.height * 0.15, 0, Math.PI * 2, true);
        this.context.strokeStyle = "white";
        this.context.lineWidth = 6;
        // this.context.globalCompositeOperation = "screen";
        this.context.stroke();
        this.context.closePath();
        this.context.clip();

        this.context.drawImage(
            this.image,
            -this.canvas.width * 0.2 +
            (this.canvas.width - this.canvas.width * 1.4) * (this.distPoint.x * 1), //0.05,
            -this.canvas.height * 0.2 +
            (this.canvas.height - this.canvas.height * 1.4) * (this.distPoint.y * 1), //0.05,
            this.canvas.width * 1.4,
            this.canvas.height * 1.4
        );
        // this.context.opacity = 1;

        this.context.restore();

    }

    loop() {
        this.raf = window.requestAnimationFrame(this.loop.bind(this));

        const now = Date.now();
        const delta = now - this.then;

        if (delta > this.fpsInterval) {
            // this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height )
            this.render();
            this.then = now;
        }
    }

    onMouseMove(ev) {
        var rect = this.canvas.getBoundingClientRect();
        this.point = {
            x:
                (ev.clientX - 7) - rect.left,
            y: (ev.clientY - 7) - rect.top
        };

        this.distPoint = {
            x: (this.point.x - this.canvas.width * 0.5) / this.canvas.width,
            y: (this.point.y - this.canvas.height * 0.5) / this.canvas.height
        };
    }

    onTouchMove(ev) {
        var rect = this.canvas.getBoundingClientRect();
        this.point = {
            x: ev.touches[0].clientX - rect.left,
            y: ev.touches[0].clientY - rect.top
        };

        this.distPoint = {
            x: (this.point.x - this.canvas.width * 0.5) / this.canvas.width,
            y: (this.point.y - this.canvas.height * 0.5) / this.canvas.height
        };
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerWidth;
        this.screen = {
            center: { x: this.canvas.width / 2, y: this.canvas.height / 2 }
        };

        //this.reset();
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    reset() {
        window.cancelAnimationFrame(this.raf);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.loop();
    }
}

const experience = new Experience(document.body);
experience;
