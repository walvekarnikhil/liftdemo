var SlidingDoor = function() {
	var group = new THREE.Object3D();

	return group;
}


var Lift = function (width,height,depth) {
	var group = new THREE.Object3D();

	var createLiftBox = function (width,height,depth) {
		var cubeGeometry = new THREE.CubeGeometry(width,height,depth);

		var material = 
        new THREE.MeshPhongMaterial(
            {
                emissive:0x7D7DA1,
                specular:0xFFFFFF,
                shininess: 100
            });
	    
    	var cubeMesh = new THREE.Mesh(
        	cubeGeometry,material);

    	return cubeMesh;
	}

	group.add(createLiftBox(width,height,depth));

	return group;
}

