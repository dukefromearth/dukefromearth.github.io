function bgImgLoader(Path,scaleP,posZ) {
    let planeGeometry = new THREE.PlaneGeometry(1,1);
    let planeMaterial = new THREE.MeshLambertMaterial();
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);

    planeTexture = new THREE.Texture();
    let planeImage = new THREE.ImageLoader();

    planeImage.load(Path, function (img) {
        planeTexture.image = img;
        planeTexture.needsUpdate = true;
    });
    plane.position.x = 0;
    plane.position.z = posZ;//平面中心点的位置
    plane.scale.set(1200*scaleP,900*scaleP);
    plane.material.map = planeTexture;
    plane.material.depthTest = false;
    sceneBG.add(plane);
}