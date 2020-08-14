function handrailTextureLoader(Path,imgPath) {
    handrailTexture = new THREE.Texture();
    let handrailImage = new THREE.ImageLoader();
    handrailImage.setPath(Path);
    handrailImage.load(imgPath, function (img) {
        handrailTexture.image = img;
        handrailTexture.needsUpdate = true; //如果纹理不仅是实时更新则会变成黑色
        handrailTexture.wrapS = handrailTexture.wrapT = THREE.RepeatWrapping;
        //garmentTexture.repeat.x = garmentTexture.repeat.y = 3;
    });
}