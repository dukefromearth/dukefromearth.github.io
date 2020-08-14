function sofaTextureLoader(Path,imgPath) {
    sofaTexture = new THREE.Texture();
    let sofaImage = new THREE.ImageLoader();
    sofaImage.setPath(Path);
    sofaImage.load(imgPath, function (img) {
        sofaTexture.image = img;
        sofaTexture.needsUpdate = true; //如果纹理不仅是实时更新则会变成黑色
        sofaTexture.wrapS = sofaTexture.wrapT = THREE.RepeatWrapping;
        //garmentTexture.repeat.x = garmentTexture.repeat.y = 3;
    });
}