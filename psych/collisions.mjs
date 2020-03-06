export default class Collisions {
    constructor(){};
    detect_rect(rect1, rect2) {
        if (rect1.x - rect1.width < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y - rect1.height < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y) {
            return true;
        }
        return false;
    }
    detect_cir(cir, cir2){
        let distance = Math.hypot((cir.x - cir2.x), (cir.y - cir2.y));
        if (distance < (cir.r + cir2.r)) return true;
        else return false;
    }
}