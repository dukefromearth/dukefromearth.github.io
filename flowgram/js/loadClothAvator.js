function loadClothAvator(scene,objrenti,mtlrenti,cloth1,texture1,garmentTexture) {


    var mtlLoader = new THREE.MTLLoader();
    var renti = THREE.Mesh;
    mtlLoader.load(mtlrenti, function (materials) {
        materials.preload();

        var loader4 = new THREE.OBJLoader();
        loader4.setMaterials(materials);
        loader4.load(objrenti, function (object) {



            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                   child.position.y = -50;
                }
            });



            renti = object;
            console.log(renti);
            scene.add(renti);
        })
    });




    var loader = new THREE.ImageLoader();
    loader.load(texture1, function (image) {

        garmentTexture.image = image;
        garmentTexture.needsUpdate = true;

    });

    var qipao = THREE.Mesh;
    var loader2 = new THREE.OBJLoader();
    loader2.load(cloth1, function (object) {

        object.traverse(function (child) {

            if (child instanceof THREE.Mesh) {
                child.material.map = garmentTexture;
                child.position.y = -50;
            }

        });
        qipao = object;

        scene.add(qipao);
    })
}