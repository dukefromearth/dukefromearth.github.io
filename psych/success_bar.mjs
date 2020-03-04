export default class Success_bar{
    constructor(max_height){
        this.max_height = max_height;
        this.width = 20;
        this.height = -20;
    }
    update(up){
        if(up) {
            if(-this.height < this.max_height - 40) {
                this.height-=2;
            };
        }
        else {
            if (this.height <= -20) this.height+= 1;
        }
    }
    draw(context){
        context.save();
        context.fillStyle = 'green';
        context.fillRect(20, this.max_height, this.width, this.height);
        context.restore();
    }
}