export default class Success_bar{
    constructor(max_height, max_width){
        this.max_height = max_height;
        this.max_width = max_width;
        this.width = 20;
        this.height = -20;
        this.slider = {x: 20, y: max_height/2, width: 20, height: 20}
    }
    update(up){
        if(up) {
            if(this.slider.y > 20 + this.slider.height) {
                this.slider.y-=2;
            };
        }
        else {
            if (this.slider.y <= this.max_height - this.slider.height) this.slider.y+=2;
        }
    }
    draw(context){
        context.save();
        context.fillStyle = 'green';
        context.fillRect(20, 40, this.width, this.max_height/2);
        context.fillStyle = 'red';
        context.fillRect(20, this.max_height/2, this.width, this.max_height/2);
        context.fillStyle = 'white';
        context.fillRect(this.slider.x, this.slider.y, this.slider.width, this.slider.height);
        context.restore();
    }
}