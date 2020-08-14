function sofaLoader(Path,sofaPath,posX) {
    let garment = new THREE.OBJLoader();
    garment.setPath(Path);
    garment.load(sofaPath, function (obj) {
        obj.position.y = -30;
        obj.position.x = posX;
        obj.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material.map = sofaTexture;
                console.log(child.name);
                function animation() {
                    child.material.color.r = para.r / 255;
                    child.material.color.g = para.g / 255;
                    child.material.color.b = para.b / 255;
                    requestAnimationFrame(animation);
                }
                animation();
            }
        });
        scene.add(obj);
    });
}