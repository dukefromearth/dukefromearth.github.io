function avatorLoader(Path,avatormtlPath,avatorobjPath,posX) {


    let mtlloader = new THREE.MTLLoader();
    mtlloader.setPath(Path);
    mtlloader.load(avatormtlPath, function (mtl) {
        mtl.preload();

        let objloader = new THREE.OBJLoader();
        objloader.setMaterials(mtl);
        objloader.setPath(Path);
        objloader.load(avatorobjPath, function (object) {
            object.position.y = -30;
            object.position.x = posX;
            scene.add(object);
            console.log('obj&mtlshown');
        });

    });

}


