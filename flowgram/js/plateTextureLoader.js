function plateTextureLoader(Path,imgPath) {
    plateTexture = new THREE.Texture();
    let plateImage = new THREE.ImageLoader();
    plateImage.setPath(Path);
    plateImage.load(imgPath, function (img) {
        plateTexture.image = img;
        plateTexture.needsUpdate = true; //如果纹理不仅是实时更新则会变成黑色
        plateTexture.wrapS = plateTexture.wrapT = THREE.RepeatWrapping;
        //garmentTexture.repeat.x = garmentTexture.repeat.y = 3;
    });
}