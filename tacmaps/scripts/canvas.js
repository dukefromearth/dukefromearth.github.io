import Symbol from "./symbols.js";

var synth = new Tone.Synth().toDestination();
synth.volume.value = -12;

class Experience {
    constructor(container) {
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute('aria-label', "canvas, this canvas can be interacted with.");
        this.canvas.setAttribute('aria-describedby', "canvas");
        this.canvas.setAttribute('role', "application");
        this.canvas.setAttribute('alt', "Interactive map");
        this.canvas.setAttribute('aria-describedby', "Interactive map");
        this.canvas.setAttribute('aria-roledescription', "Interactive map");
        container.appendChild(this.canvas);
        this.context = this.canvas.getContext("2d");

        const fps = 60;//60
        this.fpsInterval = 1000 / fps;
        this.then = Date.now();

        this.point = { x: 0, y: 0 };
        this.distPoint = { x: 0, y: 0 };
        this.pos = { x: 0, y: 0 };
        this.audioIsEnabled = false;
        this.resize();
        this.bind();
        this.image = new Image();
        this.handleCors('./assets/canvas.png', this.loadImage, true);
        this.symbols = [];
        this.symbols.push(new Symbol('Emergency Plans', 'h1'))
        this.symbols.push(new Symbol('Turn right', 'p'));
        this.symbols.push(new Symbol('Walk 20 feet', 'p'));
        this.symbols.push(new Symbol('Turn left', 'p'));
        this.symbols.push(new Symbol('Walk 8 feet', 'p'));
        this.symbols.push(new Symbol('Exit through door', 'p'));
        this.speechEnabled = 'speechSynthesis' in window ? true : false;
        this.lastLocation = [0, 0, 0];
        this.lastSpoken = Date.now();
        this.tts = new SpeechSynthesisUtterance();
    }

    handleCors(targetUrl, callback, isLocal) {
        if (isLocal) {
            this.loadImage(targetUrl, this);
            return;
        }
        let self = this;
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result, self);
            };
            reader.readAsDataURL(xhr.response);
        };
        var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        xhr.open('GET', proxyUrl + targetUrl);
        xhr.responseType = 'blob';
        xhr.send();
    }

    loadImage(path, self) {
        self.image.src = path;
        self.image.crossOrigin = "Anonymous";
        self.image.ratio = self.image.width / self.image.height;
        self.image.onload = () => {
            self.loop();
        };
    };

    bind() {
        let self = this;
        window.addEventListener("resize", this.resize.bind(this), false);
        this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
        this.canvas.addEventListener('click', function (e) {
            self.audioIsEnabled = true;
            Tone.start();
            self.canvas.removeEventListener('click', function (e) { });
        })
        this.canvas.addEventListener("touchmove", function (e) {
            e.preventDefault();
            self.onTouchMove(e);
        });
    }

    getRGB() {
        let sum = 0;
        let num = 0;
        let size = 5;
        let rgb = [0, 0, 0];
        rgb[0] = this.context.getImageData(this.pos.x, this.pos.y, 1, 1).data[0];
        rgb[1] = this.context.getImageData(this.pos.x, this.pos.y, 1, 1).data[1];
        rgb[2] = this.context.getImageData(this.pos.x, this.pos.y, 1, 1).data[2];
        // if (this.pos.x < size || this.pos.x > this.canvas.width - size || this.pos.y < size || this.pos.y > this.canvas.height - size) {
        //     return this.context.getImageData(this.pos.x, this.pos.y, 1, 1).data[0];
        // } else {
        //     for (let i = this.pos.x - size; i < this.pos.x + size; i++) {
        //         for (let j = this.pos.y - size; j < this.pos.y + size; j++) {
        //             // console.log(this.context.getImageData(this.pos.x, this.pos.y, 1, 1).data[0]);

        //             sum += this.context.getImageData(this.pos.x, this.pos.y, 1, 1).data[0];
        //             num++;
        //         }
        //     }
        // }
        return rgb;
    }

    handleAudio() {
        if (!this.audioIsEnabled) return;
        let rgb = this.getRGB();
        if (rgb[0] === 255 && !rgb[1] && !rgb[2]) {
            synth.triggerAttackRelease("C4", 0.01)
        } else if (rgb[1] === 255 && !rgb[0] && !rgb[2]) {
            synth.triggerAttackRelease("D4", 0.01)
        } else if (rgb[2] === 255 && !rgb[0] && !rgb[1]) {
            synth.triggerAttackRelease("E4", 0.01)
        } else {
            synth.triggerAttackRelease(this.getAvg(rgb), 0.01)
        }
        if (!(this.lastLocation === rgb) && Date.now() - this.lastSpoken > 1500) {
            if (rgb[0] === 255 && !rgb[1] && !rgb[2]) {
                if (this.tts.text != "Destination"); {
                    this.tts.text = "Destination";
                    window.speechSynthesis.speak(this.tts);
                    this.lastSpoken = Date.now();
                }

            } else if (rgb[1] === 255 && !rgb[0] && !rgb[2]) {
                if (this.tts.text != "Start"); {
                    this.tts.text = "Start";
                    window.speechSynthesis.speak(this.tts);
                    this.lastSpoken = Date.now();
                }
            } else if (rgb[2] === 255 && !rgb[0] && !rgb[1]) {
                if (this.tts.text != "Path"); {
                    this.tts.text = "Path";
                    window.speechSynthesis.speak(this.tts);
                    this.lastSpoken = Date.now();
                }
            }
        }
        this.lastLocation = [...rgb];
    }
    getAvg(arr) {
        return arr.reduce((sume, el) => sume + el, 0) / arr.length;
    }
    render() {
        this.clear();
        let width = this.canvas.width * 4 / 5;
        let height = width * this.image.height / this.image.width;
        this.context.drawImage(this.image, this.canvas.width / 2 - width / 2, this.canvas.height / 2 - height / 2, width, height);


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
            (this.canvas.width - this.canvas.width * 5 / 4 * 1.4) * (this.distPoint.x * 1), //0.05,
            -this.canvas.height * 0.2 +
            (this.canvas.height - height * this.image.width / this.image.height * 1.4) * (this.distPoint.y * 1), //0.05,
            this.canvas.width * 1.4,
            this.canvas.height * 1.4
        );
        // this.context.opacity = 1;
        this.handleAudio();
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
            x: (ev.clientX - 7) - rect.left,
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
        this.canvas.height = window.innerHeight;
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
let container = document.createElement('div');
document.body.appendChild(container);
const experience = new Experience(container);
// experience;
